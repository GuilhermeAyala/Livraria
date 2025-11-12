// src/componentes/FavoritosContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const raw = localStorage.getItem("meus_favoritos");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("meus_favoritos", JSON.stringify(favoritos));
    } catch {}
  }, [favoritos]);

  function adicionarFavorito(book) {
    setFavoritos(prev => {
      if (prev.some(b => b.id === book.id)) return prev;
      return [...prev, { id: book.id, name: book.name, autor: book.autor, price: book.price }];
    });
  }

  function removerFavorito(id) {
    setFavoritos(prev => prev.filter(b => b.id !== id));
  }

  return (
    <FavoritosContext.Provider value={{ favoritos, adicionarFavorito, removerFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContext);
  if (!contexto) throw new Error("useFavoritos deve ser usado dentro de FavoritosProvider");
  return contexto;
}