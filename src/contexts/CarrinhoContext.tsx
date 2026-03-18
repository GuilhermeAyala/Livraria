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
 
const STORAGE_KEY = "carrinho";
 
export const CarrinhoProvider = ({ children }: { children: React.ReactNode }) => {
  const [livrosNoCarrinho, setLivrosNoCarrinho] = useState<BookNoCarrinho[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
 
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(livrosNoCarrinho));
    } catch {}
  }, [livrosNoCarrinho]);
 
  const adicionarAoCarrinho = (book: Book) => {
    setLivrosNoCarrinho((prev) => {
      const existe = prev.find((b) => b.id === book.id);
      if (existe) {
        return prev.map((b) =>
          b.id === book.id ? { ...b, quantidade: b.quantidade + 1 } : b
        );
      }
      return [...prev, bookParaCarrinho(book)];
    });
  };
 
  const alterarQuantidade = (id: number, qtd: string) => {
    setLivrosNoCarrinho((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, quantidade: Math.max(0, Number(qtd) || 0) } : b
      )
    );
  };
 
  const removerDoCarrinho = (id: number) => {
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
 
