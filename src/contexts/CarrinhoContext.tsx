import React, { createContext, useContext, useState, useEffect } from "react";
import { Book } from "../models/booksModel";
import { BookNoCarrinho, bookParaCarrinho } from "../data/carrinho";
import {
  adicionarLivroAoCarrinho,
  alterarLivroNoCarrinho,
  getCarrinho,
  removerLivroDoCarrinho,
} from "../api/booksApi";
 
type CarrinhoContextType = {
  livrosNoCarrinho: BookNoCarrinho[];
  adicionarAoCarrinho: (book: Book) => void;
  alterarQuantidade: (id: number, qtd: string) => void;
  removerDoCarrinho: (id: number) => void;
  limparCarrinho: () => void;
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

  useEffect(() => {
    getCarrinho()
      .then(setLivrosNoCarrinho)
      .catch(() => {});
  }, []);
 
  const adicionarAoCarrinho = async (book: Book) => {
    setLivrosNoCarrinho((prev) => {
      const existe = prev.find((b) => b.id === book.id);
      if (existe) {
        return prev.map((b) =>
          b.id === book.id ? { ...b, quantidade: b.quantidade + 1 } : b
        );
      }
      return [...prev, bookParaCarrinho(book)];
    });

    try {
      await adicionarLivroAoCarrinho(book.id);
      const carrinhoAtualizado = await getCarrinho();
      setLivrosNoCarrinho(carrinhoAtualizado);
    } catch {}
  };
 
  const alterarQuantidade = async (id: number, qtd: string) => {
    const quantidade = Math.max(0, Number(qtd) || 0);
    setLivrosNoCarrinho((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, quantidade } : b
      )
    );

    try {
      await alterarLivroNoCarrinho(id, quantidade);
      const carrinhoAtualizado = await getCarrinho();
      setLivrosNoCarrinho(carrinhoAtualizado);
    } catch {}
  };
 
  const removerDoCarrinho = async (id: number) => {
    setLivrosNoCarrinho((prev) => prev.filter((b) => b.id !== id));

    try {
      await removerLivroDoCarrinho(id);
    } catch {}
  };

  const limparCarrinho = () => {
    setLivrosNoCarrinho([]);
  };
 
  return (
    <CarrinhoContext.Provider
      value={{ livrosNoCarrinho, adicionarAoCarrinho, alterarQuantidade, removerDoCarrinho, limparCarrinho }}
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
 
