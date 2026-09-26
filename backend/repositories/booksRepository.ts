import { prisma } from "../prismaClient";

export type BookCreateData = {
  name: string;
  autor: string;
  year: number;
  price: number;
  quantity: number;
  isAvailable: boolean;
};

export type BookUpdateData = Partial<BookCreateData>;

export class BooksRepository {
  findAll() {
    return prisma.book.findMany({
      orderBy: { id: "asc" },
    });
  }

  findById(id: number) {
    return prisma.book.findUnique({
      where: { id },
    });
  }

  create(data: BookCreateData) {
    return prisma.book.create({
      data,
    });
  }

  update(id: number, data: BookUpdateData) {
    return prisma.book.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    await prisma.book.delete({
      where: { id },
    });
  }
}
