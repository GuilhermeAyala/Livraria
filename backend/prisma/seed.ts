import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export const livrosIniciais = [
  {
    name: "Crime e Castigo",
    autor: "Dostoievsky",
    ano: 1886,
    price: 50.0,
    quantidade: 2,
    isAvailable: true,
  },
  {
    name: "Dom Casmurro",
    autor: "Machado de Assis",
    ano: 1800,
    price: 32.5,
    quantidade: 2,
    isAvailable: true,
  },
  {
    name: "Os miseraveis",
    autor: "Victor Hugo",
    ano: 1862,
    price: 45.0,
    quantidade: 1,
    isAvailable: true,
  },
  {
    name: "Hamlet",
    autor: "William Shakespeare",
    ano: 1623,
    price: 42.0,
    quantidade: 1,
    isAvailable: true,
  },
  {
    name: "O Poderoso Chefao",
    autor: "Mario Puzo",
    ano: 1969,
    price: 20.0,
    quantidade: 1,
    isAvailable: true,
  },
  {
    name: "1984",
    autor: "George Orwell",
    ano: 1949,
    price: 45.0,
    quantidade: 1,
    isAvailable: true,
  },
  {
    name: "O Livro Vermelho",
    autor: "Mao Tse-Tung",
    ano: 1954,
    price: 23.0,
    quantidade: 1,
    isAvailable: true,
  },
];

//simulação do banco, por hora