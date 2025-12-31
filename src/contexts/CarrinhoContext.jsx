import React, { createContext, useContext, useState, useEffect } from "react";

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const STORAGE_KEY = "carrinho";
  const [livrosNoCarrinho, setLivrosNoCarrinho] = useState(() => {
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

  const adicionarAoCarrinho = (book) => {
    setLivrosNoCarrinho((prev) => {
      const existe = prev.find((b) => b.id === book.id);
      if (existe) {
        return prev.map((b) =>
          b.id === book.id ? { ...b, quantidade: b.quantidade + 1 } : b
        );
      } else {
        return [...prev, { ...book, quantidade: 1 }];
      }
    });
  };

  const alterarQuantidade = (id, qtd) => {
    setLivrosNoCarrinho((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, quantidade: Math.max(0, Number(qtd) || 0) } : b
      )
    );
  };

  const removerDoCarrinho = (id) => {
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

export const useCarrinho = () => useContext(CarrinhoContext);
