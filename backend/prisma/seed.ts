import { prisma } from "../prismaClient";
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
      name: "Usuario Demo",
      email: "usuario1@livraria.local",
      passwordHash: "seed",
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
}

main().finally(async () => {
  await prisma.$disconnect();
});
