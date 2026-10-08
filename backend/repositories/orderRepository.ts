import { prisma } from "../prismaClient";
import type { Prisma } from "../generated/prisma/client";

type DatabaseClient = typeof prisma | Prisma.TransactionClient;

const orderInclude = {
  items: {
    include: {
      book: {
        select: { id: true, name: true, autor: true, price: true },
      },
    },
  },
  user: {
    select: { id: true, name: true, email: true, address: true },
  },
} as const;

export class OrderRepository {
  listByUser(userId: number, db: DatabaseClient = prisma) {
    return db.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  listAll(db: DatabaseClient = prisma) {
    return db.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: number, db: DatabaseClient = prisma) {
    return db.order.findUnique({
      where: { id },
      include: orderInclude,
    });
  }

  findCartItems(userId: number, db: DatabaseClient = prisma) {
    return db.cartItem.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { id: "asc" },
    });
  }

  create(data: Prisma.OrderCreateInput, db: DatabaseClient = prisma) {
    return db.order.create({ data, include: orderInclude });
  }

  async decreaseStock(bookId: number, quantity: number, db: DatabaseClient) {
    return db.book.updateMany({
      where: { id: bookId, isAvailable: true, quantity: { gte: quantity } },
      data: { quantity: { decrement: quantity } },
    });
  }

  markUnavailableIfEmpty(bookId: number, db: DatabaseClient) {
    return db.book.updateMany({
      where: { id: bookId, quantity: 0 },
      data: { isAvailable: false },
    });
  }

  clearCart(userId: number, db: DatabaseClient) {
    return db.cartItem.deleteMany({ where: { userId } });
  }

  restoreStock(bookId: number, quantity: number, db: DatabaseClient) {
    return db.book.update({
      where: { id: bookId },
      data: { quantity: { increment: quantity }, isAvailable: true },
    });
  }

  updateStatus(id: number, status: Prisma.OrderUpdateInput["status"], db: DatabaseClient = prisma) {
    return db.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    });
  }

  updateStatusIfCurrent(
    id: number,
    currentStatus: Prisma.OrderWhereInput["status"],
    nextStatus: Prisma.OrderUpdateInput["status"],
    db: DatabaseClient,
  ) {
    return db.order.updateMany({
      where: { id, status: currentStatus },
      data: { status: nextStatus },
    });
  }
}
