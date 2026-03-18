import { Book } from "../models/booksModel";

type BookBase = {
  name: string;
  autor: string;
  price: number;
  quantidade: number;
  getTotal?: () => number;
};
 
const BASE_URL = "http://localhost:3000/api";
 
// Buscar todos os livros
export async function getLivros(): Promise<Book[]> {
  const resposta = await fetch(`${BASE_URL}/livros`);
  if (!resposta.ok) throw new Error("Erro ao buscar livros");
  return resposta.json();
}
 
// Adicionar um novo livro (Admin)
export async function adicionarLivro(livro: Omit<Book, "id" | "getTotal">): Promise<void> {
  const resposta = await fetch(`${BASE_URL}/livros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(livro),
  });
  if (!resposta.ok) throw new Error("Erro ao adicionar livro");
}
 
// Atualizar livro existente (Admin)
export async function atualizarLivro(id: number, dados: Partial<Book>): Promise<void> {
  const resposta = await fetch(`${BASE_URL}/livros/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error("Erro ao atualizar livro");
}
 
// Remover livro (Admin)
export async function removerLivro(id: number): Promise<void> {
  const resposta = await fetch(`${BASE_URL}/livros/${id}`, {
    method: "DELETE",
  });
  if (!resposta.ok) throw new Error("Erro ao remover livro");
}
 
// Funções auxiliares de lógica (sem fetch) — usadas pelo Carrinho
export function detalheDaCompra(books: BookBase[]) {
  return books.map((book) => ({
    name: book.name,
    autor: book.autor,
    price: book.price,
    quantidade: book.quantidade,
    total: book.getTotal ? book.getTotal() : book.price * book.quantidade,
  }));
}
 
export function calcularTotal(books: BookBase[]): number {
  return books.reduce((acc, book) => acc + book.price * book.quantidade, 0);
}