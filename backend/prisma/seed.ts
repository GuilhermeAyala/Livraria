import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@livraria.local" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@livraria.local",
      passwordHash: "seed",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "usuario1@livraria.local" },
    update: {},
    create: {
      id: 1,
      name: "Usuario Demo",
      email: "usuario1@livraria.local",
      passwordHash: "seed",
      role: "USER",
    },
  });

  const books = [
    { name: "Crime e Castigo", autor: "Dostoievsky", year: 1886, price: 50, quantity: 2 },
    { name: "Dom Casmurro", autor: "Machado de Assis", year: 1800, price: 32.5, quantity: 2 },
    { name: "Os miseraveis", autor: "Victor Hugo", year: 1862, price: 45, quantity: 1 },
    { name: "Hamlet", autor: "William Shakespeare", year: 1623, price: 42, quantity: 1 },
    { name: "O Poderoso Chefao", autor: "Mario Puzo", year: 1969, price: 20, quantity: 1 },
    { name: "1984", autor: "George Orwell", year: 1949, price: 45, quantity: 1 },
    { name: "O Livro Vermelho", autor: "Mao Tse-Tung", year: 1954, price: 23, quantity: 1 },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { id: books.indexOf(book) + 1 },
      update: book,
      create: { id: books.indexOf(book) + 1, ...book, isAvailable: book.quantity > 0 },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
