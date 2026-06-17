import { prisma } from "../config/prisma";

type BookInput = {
  name: string;
  autor: string;
  year: number;
  price: number;
  quantity: number;
  isAvailable?: boolean;
};

function toFrontendBook(book: {
  id: number;
  name: string;
  autor: string;
  year: number;
  price: number;
  quantity: number;
  isAvailable: boolean;
}) {
  return {
    id: book.id,
    name: book.name,
    autor: book.autor,
    year: book.year,
    price: book.price,
    quantidade: book.quantity,
    isAvailable: book.isAvailable,
  };
}

export async function listBooks() {
  const books = await prisma.book.findMany({
    orderBy: { id: "asc" },
  });

  return books.map(toFrontendBook);
}

export async function createBook(data: BookInput) {
  const book = await prisma.book.create({
    data: {
      name: data.name,
      autor: data.autor,
      year: Number(data.year),
      price: Number(data.price),
      quantity: Number(data.quantity),
      isAvailable: data.isAvailable ?? Number(data.quantity) > 0,
    },
  });

  return toFrontendBook(book);
}

export async function updateBook(id: number, data: Partial<BookInput>) {
  const book = await prisma.book.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.autor !== undefined ? { autor: data.autor } : {}),
      ...(data.year !== undefined ? { year: Number(data.year) } : {}),
      ...(data.price !== undefined ? { price: Number(data.price) } : {}),
      ...(data.quantity !== undefined ? { quantity: Number(data.quantity) } : {}),
      ...(data.isAvailable !== undefined ? { isAvailable: data.isAvailable } : {}),
    },
  });

  return toFrontendBook(book);
}

export async function deleteBook(id: number) {
  await prisma.book.delete({ where: { id } });
}

export { toFrontendBook };
