import { prisma } from "../prismaClient";
import { hashPassword } from "../auth";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
//dados de desenvolvimento - dados oficiais da aplicação em Books, já estão no postgres e funcionando

const livrosIniciais = [
  { name: "Crime e Castigo", autor: "Dostoievsky", year: 1886, price: 50, quantity: 2 },
  { name: "Dom Casmurro", autor: "Machado de Assis", year: 1800, price: 32.5, quantity: 2 },
  { name: "Os miseraveis", autor: "Victor Hugo", year: 1862, price: 45, quantity: 1 },
  { name: "Hamlet", autor: "William Shakespeare", year: 1623, price: 42, quantity: 1 },
  { name: "O Poderoso Chefao", autor: "Mario Puzo", year: 1969, price: 20, quantity: 1 },
  { name: "1984", autor: "George Orwell", year: 1949, price: 45, quantity: 1 },
  { name: "O Livro Vermelho", autor: "Mao Tse-Tung", year: 1954, price: 23, quantity: 1 },
];

async function main() {
  const admin = {
    name: process.env.DEV_ADMIN_NAME ?? "Administrador",
    email: process.env.DEV_ADMIN_EMAIL ?? "admin@livraria.local",
    password: process.env.DEV_ADMIN_PASSWORD ?? "Admin@12345",
    CPF: process.env.DEV_ADMIN_CPF ?? "00000000001",
  };
  const user = {
    name: process.env.DEV_USER_NAME ?? "Usuario Demo",
    email: process.env.DEV_USER_EMAIL ?? "usuario1@livraria.local",
    password: process.env.DEV_USER_PASSWORD ?? "Usuario@12345",
    CPF: process.env.DEV_USER_CPF ?? "00000000002",
  };

  await prisma.user.upsert({
    where: { email: admin.email },
    update: { name: admin.name, CPF: admin.CPF, passwordHash: hashPassword(admin.password) },
    create: {
      name: admin.name,
      email: admin.email,
      CPF: admin.CPF,
      passwordHash: hashPassword(admin.password),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: user.email },
    update: { name: user.name, CPF: user.CPF, passwordHash: hashPassword(user.password) },
    create: {
      name: user.name,
      email: user.email,
      CPF: user.CPF,
      passwordHash: hashPassword(user.password),
      role: "USER",
    },
  });

  for (const [index, livro] of livrosIniciais.entries()) {
    await prisma.book.upsert({
      where: { id: index + 1 },
      update: { ...livro, isAvailable: livro.quantity > 0 },
      create: { id: index + 1, ...livro, isAvailable: livro.quantity > 0 },
    });
  }

  // O seed usa IDs fixos para manter os livros de desenvolvimento estaveis.
  // Depois disso, a sequencia precisa apontar para o proximo ID disponivel.
  const sequenceRows = await prisma.$queryRawUnsafe<Array<{ sequence_name: string | null }>>(`
    SELECT pg_get_serial_sequence('public."Book"', 'id') AS sequence_name;
  `);

  const sequenceName = sequenceRows[0]?.sequence_name;
  if (!sequenceName) {
    throw new Error('A sequencia da coluna public."Book".id nao foi encontrada.');
  }

  await prisma.$executeRawUnsafe(
    `SELECT setval($1::regclass, COALESCE((SELECT MAX(id) FROM public."Book"), 0) + 1, false);`,
    sequenceName,
  );
}

main().finally(async () => {
  await prisma.$disconnect();
});
