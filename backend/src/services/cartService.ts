import { prisma } from "../config/prisma";
import { toFrontendBook } from "./bookService";
import { ensureUser } from "./userService";

function toCartItem(item: {
  quantity: number;
  book: {
    id: number;
    name: string;
    autor: string;
    year: number;
    price: number;
    quantity: number;
    isAvailable: boolean;
  };
}) {
  return {
    ...toFrontendBook(item.book),
    quantidade: item.quantity,
  };
}

export async function getCart(userId: number) {
  await ensureUser(userId);

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { book: true },
    orderBy: { id: "asc" },
  });

  return items.map(toCartItem);
}

export async function addCartItem(userId: number, bookId: number, quantity = 1) {
  await ensureUser(userId);

  const item = await prisma.cartItem.upsert({
    where: { userId_bookId: { userId, bookId } },
    create: { userId, bookId, quantity },
    update: { quantity: { increment: quantity } },
    include: { book: true },
  });

  return toCartItem(item);
}

export async function updateCartItem(userId: number, bookId: number, quantity: number) {
  await ensureUser(userId);

  if (quantity <= 0) {
    await removeCartItem(userId, bookId);
    return null;
  }

  const item = await prisma.cartItem.update({
    where: { userId_bookId: { userId, bookId } },
    data: { quantity },
    include: { book: true },
  });

  return toCartItem(item);
}

export async function removeCartItem(userId: number, bookId: number) {
  await ensureUser(userId);

  await prisma.cartItem.delete({
    where: { userId_bookId: { userId, bookId } },
  });
}

export async function clearCart(userId: number) {
  await prisma.cartItem.deleteMany({ where: { userId } });
}
