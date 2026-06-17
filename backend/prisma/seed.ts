import { createHmac, randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", salt).update(password).digest("hex");
  return `${salt}:${hash}`;
}

async function main() {
  await prisma.user.upsert({
    where: { email: "usuario@livraria.local" },
    update: {
      name: "Usuario Demo",
      passwordHash: hashPassword("123456"),
      role: "USER",
    },
    create: {
      name: "Usuario Demo",
      email: "usuario@livraria.local",
      passwordHash: hashPassword("123456"),
      role: "USER",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@livraria.local" },
    update: {
      name: "Administrador",
      passwordHash: hashPassword("admin123"),
      role: "ADMIN",
    },
    create: {
      name: "Administrador",
      email: "admin@livraria.local",
      passwordHash: hashPassword("admin123"),
      role: "ADMIN",
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

  for (const [index, book] of books.entries()) {
    await prisma.book.upsert({
      where: { id: index + 1 },
      update: { ...book, isAvailable: book.quantity > 0 },
      create: { id: index + 1, ...book, isAvailable: book.quantity > 0 },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
