// src/componentes/FavoritosContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritosContext = createContext();
const STORAGE_KEY = "meus_favoritos_v2";
const LEGACY_STORAGE_KEY = "meus_favoritos";

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
    } catch {}
  }, [favoritos]);

  function adicionarFavorito(book) {
    setFavoritos(prev => {
      if (prev.some(b => b.id === book.id)) return prev;
      return [...prev, {
        id: book.id,
        name: book.name,
        autor: book.autor,
        year: book.year,
        price: book.price,
        isAvailable: book.isAvailable,
      }];
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
