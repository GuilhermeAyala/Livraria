import { OrderStatus, PaymentMethod } from "../generated/prisma/client";

export const orderStatusFlow: OrderStatus[] = [
  OrderStatus.AGUARDANDO_PAGAMENTO,
  OrderStatus.PAGAMENTO_EM_ANALISE,
  OrderStatus.PAGO,
  OrderStatus.EM_SEPARACAO,
  OrderStatus.ENVIADO,
  OrderStatus.SAIU_PARA_ENTREGA,
  OrderStatus.ENTREGUE,
];

export const orderStatusIndex: Record<OrderStatus, number> = {
  [OrderStatus.AGUARDANDO_PAGAMENTO]: 0,
  [OrderStatus.PAGAMENTO_EM_ANALISE]: 1,
  [OrderStatus.PAGO]: 2,
  [OrderStatus.EM_SEPARACAO]: 3,
  [OrderStatus.ENVIADO]: 4,
  [OrderStatus.SAIU_PARA_ENTREGA]: 5,
  [OrderStatus.ENTREGUE]: 6,
  [OrderStatus.CANCELADO]: -1,
};

export const paymentDiscount: Record<PaymentMethod, number> = {
  [PaymentMethod.CREDITO]: 0.2,
  [PaymentMethod.DEBITO]: 0,
  [PaymentMethod.PIX]: 0.15,
  [PaymentMethod.BOLETO]: 0.15,
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && Object.values(OrderStatus).includes(value as OrderStatus);
}

export function statusFromIndex(index: number): OrderStatus | null {
  return orderStatusFlow[index] ?? null;
}
