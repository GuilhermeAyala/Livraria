import { prisma } from "../config/prisma";
import { clearCart, getCart } from "./cartService";
import { ensureUser } from "./userService";

export type PaymentMethod = "CREDITO" | "DEBITO" | "PIX" | "BOLETO";

const paymentDiscounts: Record<PaymentMethod, number> = {
  CREDITO: 0.2,
  DEBITO: 0,
  PIX: 0.15,
  BOLETO: 0.15,
};

export async function createOrder(userId: number, paymentMethod: PaymentMethod) {
  await ensureUser(userId);

  const cart = await getCart(userId);

  if (cart.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  const subtotal = cart.reduce((total: number, item: any) => total + item.price * item.quantidade, 0);
  const discount = subtotal * (paymentDiscounts[paymentMethod] ?? 0);
  const total = subtotal - discount;

  const order = await prisma.order.create({
    data: {
      userId,
      paymentMethod,
      subtotal,
      discount,
      total,
      items: {
        create: cart.map((item: any) => ({
          bookId: item.id,
          quantity: item.quantidade,
          unitPrice: item.price,
        })),
      },
    },
    include: { items: true },
  });

  await clearCart(userId);

  return order;
}
