import { randomInt } from "node:crypto";
import { OrderStatus, PaymentMethod } from "../generated/prisma/client";
import { prisma } from "../prismaClient";
import {
  isOrderStatus,
  orderStatusIndex,
  paymentDiscount,
  statusFromIndex,
} from "../constants/order";
import { OrderRepository } from "../repositories/orderRepository";

type CreateOrderPayload = { paymentMethod?: unknown };
type UpdateStatusPayload = { status?: unknown; statusIndex?: unknown };

function validateId(id: number) {
  if (!Number.isInteger(id) || id <= 0) throw new Error("Id do pedido invalido.");
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function normalizePaymentMethod(value: unknown): PaymentMethod {
  if (typeof value !== "string") throw new Error("Informe uma forma de pagamento.");

  const normalized = value
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const aliases: Record<string, PaymentMethod> = {
    CREDITO: PaymentMethod.CREDITO,
    DEBITO: PaymentMethod.DEBITO,
    PIX: PaymentMethod.PIX,
    BOLETO: PaymentMethod.BOLETO,
  };

  const paymentMethod = aliases[normalized];
  if (!paymentMethod) throw new Error("Forma de pagamento invalida.");
  return paymentMethod;
}

function generatePaymentReference(paymentMethod: PaymentMethod) {
  if (paymentMethod !== PaymentMethod.BOLETO) return null;
  return Array.from({ length: 48 }, () => randomInt(0, 10)).join("");
}

function serializeOrder(order: any) {
  return {
    ...order,
    statusIndex: order.status === OrderStatus.CANCELADO ? -1 : orderStatusIndex[order.status as OrderStatus],
    paymentReference: order.paymentReference ?? null,
  };
}

function canCancel(status: OrderStatus) {
  const cancellableStatuses: OrderStatus[] = [
    OrderStatus.AGUARDANDO_PAGAMENTO,
    OrderStatus.PAGAMENTO_EM_ANALISE,
    OrderStatus.PAGO,
    OrderStatus.EM_SEPARACAO,
  ];
  return cancellableStatuses.includes(status);
}

function canChangeStatus(current: OrderStatus, next: OrderStatus) {
  if (current === next) return true;
  if (current === OrderStatus.CANCELADO || current === OrderStatus.ENTREGUE) return false;
  if (next === OrderStatus.CANCELADO) return canCancel(current);

  const currentIndex = orderStatusIndex[current];
  const nextIndex = orderStatusIndex[next];
  return currentIndex >= 0 && nextIndex > currentIndex;
}

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async listarPedidos(userId: number, isAdmin: boolean) {
    const orders = isAdmin
      ? await this.orderRepository.listAll()
      : await this.orderRepository.listByUser(userId);
    return orders.map(serializeOrder);
  }

  async buscarPedido(id: number, userId: number, isAdmin: boolean) {
    validateId(id);
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error("Pedido nao encontrado.");
    if (!isAdmin && order.userId !== userId) throw new Error("Voce nao pode acessar este pedido.");
    return serializeOrder(order);
  }

  async criarPedido(userId: number, payload: CreateOrderPayload) {
    validateId(userId);
    const paymentMethod = normalizePaymentMethod(payload.paymentMethod);

    const order = await prisma.$transaction(async (transaction) => {
      const cartItems = await this.orderRepository.findCartItems(userId, transaction);
      if (cartItems.length === 0) throw new Error("O carrinho esta vazio.");

      let subtotal = 0;
      for (const item of cartItems) {
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error(`Quantidade invalida para o livro ${item.book.name}.`);
        }

        const stockUpdate = await this.orderRepository.decreaseStock(item.bookId, item.quantity, transaction);
        if (stockUpdate.count !== 1) {
          throw new Error(`Estoque insuficiente para o livro ${item.book.name}.`);
        }
        await this.orderRepository.markUnavailableIfEmpty(item.bookId, transaction);
        subtotal += item.book.price * item.quantity;
      }

      const subtotalRounded = roundMoney(subtotal);
      const discount = roundMoney(subtotalRounded * paymentDiscount[paymentMethod]);
      const total = roundMoney(subtotalRounded - discount);
      const initialStatus = paymentMethod === PaymentMethod.CREDITO || paymentMethod === PaymentMethod.DEBITO
        ? OrderStatus.PAGAMENTO_EM_ANALISE
        : OrderStatus.AGUARDANDO_PAGAMENTO;

      const createdOrder = await this.orderRepository.create({
        user: { connect: { id: userId } },
        paymentMethod,
        subtotal: subtotalRounded,
        discount,
        total,
        status: initialStatus,
        paymentReference: generatePaymentReference(paymentMethod),
        items: {
          create: cartItems.map((item) => ({
            book: { connect: { id: item.bookId } },
            quantity: item.quantity,
            unitPrice: item.book.price,
          })),
        },
      }, transaction);

      await this.orderRepository.clearCart(userId, transaction);
      return createdOrder;
    });

    return serializeOrder(order);
  }

  async atualizarStatus(id: number, payload: UpdateStatusPayload) {
    validateId(id);
    const current = await this.orderRepository.findById(id);
    if (!current) throw new Error("Pedido nao encontrado.");

    let nextStatus: OrderStatus | null = null;
    if (payload.status !== undefined && isOrderStatus(payload.status)) nextStatus = payload.status;
    if (nextStatus === null && payload.statusIndex !== undefined) {
      const index = Number(payload.statusIndex);
      if (Number.isInteger(index)) nextStatus = statusFromIndex(index);
    }
    if (!nextStatus) throw new Error("Status do pedido invalido.");
    if (nextStatus === OrderStatus.CANCELADO) {
      throw new Error("Use a operacao de cancelamento para cancelar o pedido.");
    }
    if (!canChangeStatus(current.status, nextStatus)) {
      throw new Error("A transicao de status do pedido nao e permitida.");
    }

    const updatedOrder = await prisma.$transaction(async (transaction) => {
      const updatedStatus = await this.orderRepository.updateStatusIfCurrent(
        id,
        current.status,
        nextStatus,
        transaction,
      );
      if (updatedStatus.count !== 1) {
        throw new Error("O pedido ja foi alterado. Atualize a pagina e tente novamente.");
      }
      return this.orderRepository.findById(id, transaction);
    });

    if (!updatedOrder) throw new Error("Pedido nao encontrado.");
    return serializeOrder(updatedOrder);
  }

  async cancelarPedido(id: number, userId: number, isAdmin: boolean) {
    validateId(id);
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error("Pedido nao encontrado.");
    if (!isAdmin && order.userId !== userId) throw new Error("Voce nao pode cancelar este pedido.");
    if (!canCancel(order.status)) throw new Error("Este pedido nao pode mais ser cancelado.");

    const cancelledOrder = await prisma.$transaction(async (transaction) => {
      const updatedStatus = await this.orderRepository.updateStatusIfCurrent(
        id,
        order.status,
        OrderStatus.CANCELADO,
        transaction,
      );
      if (updatedStatus.count !== 1) {
        throw new Error("O pedido ja foi alterado. Atualize a pagina e tente novamente.");
      }
      for (const item of order.items) {
        await this.orderRepository.restoreStock(item.bookId, item.quantity, transaction);
      }
      return this.orderRepository.findById(id, transaction);
    });

    if (!cancelledOrder) throw new Error("Pedido nao encontrado.");
    return serializeOrder(cancelledOrder);
  }
}
