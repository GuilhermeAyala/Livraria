import { Book } from "../models/booksModel";

type BookBase = {
  name: string;
  autor: string;
  price: number;
  quantidade: number;
  getTotal?: () => number;
};
 
export const BASE_URL = "http://localhost:4000/api";

const USER_HEADERS = {
  "Content-Type": "application/json",
  "x-user-id": "1",
};
 
// Buscar todos os livros
export async function getLivros(): Promise<Book[]> {
  const resposta = await fetch(`${BASE_URL}/books`);
  if (!resposta.ok) throw new Error("Erro ao buscar livros");
  return resposta.json();
}
 
// Adicionar um novo livro (Admin)
export async function adicionarLivro(livro: Omit<Book, "id" | "getTotal">): Promise<void> {
  const resposta = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: { ...USER_HEADERS, "x-user-role": "ADMIN" },
    body: JSON.stringify(livro),
  });
  if (!resposta.ok) throw new Error("Erro ao adicionar livro");
}
 
// Atualizar livro existente (Admin)
export async function atualizarLivro(id: number, dados: Partial<Book>): Promise<void> {
  const resposta = await fetch(`${BASE_URL}/books/${id}`, {
    method: "PUT",
    headers: { ...USER_HEADERS, "x-user-role": "ADMIN" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error("Erro ao atualizar livro");
}
 
// Remover livro (Admin)
export async function removerLivro(id: number): Promise<void> {
  const resposta = await fetch(`${BASE_URL}/books/${id}`, {
    method: "DELETE",
    headers: { ...USER_HEADERS, "x-user-role": "ADMIN" },
  });
  if (!resposta.ok) throw new Error("Erro ao remover livro");
}

export async function getCarrinho() {
  const resposta = await fetch(`${BASE_URL}/cart`, { headers: USER_HEADERS });
  if (!resposta.ok) throw new Error("Erro ao buscar carrinho");
  return resposta.json();
}

export async function adicionarLivroAoCarrinho(bookId: number, quantity = 1) {
  const resposta = await fetch(`${BASE_URL}/cart/items`, {
    method: "POST",
    headers: USER_HEADERS,
    body: JSON.stringify({ bookId, quantity }),
  });
  if (!resposta.ok) throw new Error("Erro ao adicionar ao carrinho");
  return resposta.json();
}

export async function alterarLivroNoCarrinho(bookId: number, quantity: number) {
  const resposta = await fetch(`${BASE_URL}/cart/items/${bookId}`, {
    method: "PATCH",
    headers: USER_HEADERS,
    body: JSON.stringify({ quantity }),
  });
  if (!resposta.ok) throw new Error("Erro ao atualizar carrinho");
  return resposta.json();
}

export async function removerLivroDoCarrinho(bookId: number) {
  const resposta = await fetch(`${BASE_URL}/cart/items/${bookId}`, {
    method: "DELETE",
    headers: USER_HEADERS,
  });
  if (!resposta.ok) throw new Error("Erro ao remover do carrinho");
}

export async function getFavoritos() {
  const resposta = await fetch(`${BASE_URL}/favorites`, { headers: USER_HEADERS });
  if (!resposta.ok) throw new Error("Erro ao buscar favoritos");
  return resposta.json();
}

export async function adicionarLivroAosFavoritos(bookId: number) {
  const resposta = await fetch(`${BASE_URL}/favorites/${bookId}`, {
    method: "POST",
    headers: USER_HEADERS,
  });
  if (!resposta.ok) throw new Error("Erro ao adicionar favorito");
  return resposta.json();
}

export async function removerLivroDosFavoritos(bookId: number) {
  const resposta = await fetch(`${BASE_URL}/favorites/${bookId}`, {
    method: "DELETE",
    headers: USER_HEADERS,
  });
  if (!resposta.ok) throw new Error("Erro ao remover favorito");
}

export async function getProfile() {
  const resposta = await fetch(`${BASE_URL}/profile`, { headers: USER_HEADERS });
  if (!resposta.ok) throw new Error("Erro ao buscar perfil");
  return resposta.json();
}

export async function updateProfile(data: { name?: string; address?: string }) {
  const resposta = await fetch(`${BASE_URL}/profile`, {
    method: "PATCH",
    headers: USER_HEADERS,
    body: JSON.stringify(data),
  });
  if (!resposta.ok) throw new Error("Erro ao salvar perfil");
  return resposta.json();
}

export async function adicionarCartaoAoPerfil(data: {
  type: string;
  holderName: string;
  brand: string;
  cardNumber: string;
  expiresAt: string;
}) {
  const resposta = await fetch(`${BASE_URL}/profile/cards`, {
    method: "POST",
    headers: USER_HEADERS,
    body: JSON.stringify(data),
  });
  if (!resposta.ok) throw new Error("Erro ao salvar cartao");
  return resposta.json();
}

export async function criarPedido(paymentMethod: "CREDITO" | "DEBITO" | "PIX" | "BOLETO") {
  const resposta = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: USER_HEADERS,
    body: JSON.stringify({ paymentMethod }),
  });
  if (!resposta.ok) throw new Error("Erro ao finalizar pedido");
  return resposta.json();
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
