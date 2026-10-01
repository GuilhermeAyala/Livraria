import React, { createContext, useContext, useState, useEffect } from "react";
import { Book } from "../models/booksModel";
import { BookNoCarrinho, bookParaCarrinho } from "../data/carrinho";
 
type CarrinhoContextType = {
  livrosNoCarrinho: BookNoCarrinho[];
  adicionarAoCarrinho: (book: Book) => void;
  alterarQuantidade: (id: number, qtd: string) => void;
  removerDoCarrinho: (id: number) => void;
};
 
const CarrinhoContext = createContext<CarrinhoContextType | null>(null);
 
const API_URL = "http://localhost:4000";

export const CarrinhoProvider = ({ children }: { children: React.ReactNode }) => {
  const [livrosNoCarrinho, setLivrosNoCarrinho] = useState<BookNoCarrinho[]>([]);

  useEffect(() => {
    const carregar = async () => {
      const response = await fetch(`${API_URL}/me/cart`, { credentials: "include" });
      if (!response.ok) return setLivrosNoCarrinho([]);
      const data = await response.json();
      setLivrosNoCarrinho(Array.isArray(data) ? data : []);
    };
    carregar().catch(() => setLivrosNoCarrinho([]));
    window.addEventListener("livraria:user-changed", carregar);
    return () => window.removeEventListener("livraria:user-changed", carregar);
  }, []);
 
  const adicionarAoCarrinho = async (book: Book) => {
    const response = await fetch(`${API_URL}/me/cart`, {
      method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookId: book.id }),
    });
    if (!response.ok) throw new Error("Nao foi possivel adicionar o livro ao carrinho.");
    const atualizado = await response.json();
    setLivrosNoCarrinho((prev) => {
      const existe = prev.some((item) => item.id === atualizado.id);
      return existe ? prev.map((item) => item.id === atualizado.id ? atualizado : item) : [...prev, atualizado];
    });
  };
 
  const alterarQuantidade = async (id: number, qtd: string) => {
    const quantidade = Math.max(0, Number(qtd) || 0);
    await fetch(`${API_URL}/me/cart/${id}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quantity: quantidade }) });
    setLivrosNoCarrinho((prev) => quantidade === 0 ? prev.filter((item) => item.id !== id) : prev.map((item) => item.id === id ? { ...item, quantidade } : item));
  };
 
  const removerDoCarrinho = async (id: number) => {
    await fetch(`${API_URL}/me/cart/${id}`, { method: "DELETE", credentials: "include" });
    setLivrosNoCarrinho((prev) => prev.filter((b) => b.id !== id));
  };
 
  return (
    <CarrinhoContext.Provider
      value={{ livrosNoCarrinho, adicionarAoCarrinho, alterarQuantidade, removerDoCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};
 
export const useCarrinho = () => {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  return ctx;
};
 
