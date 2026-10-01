// src/componentes/FavoritosContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritosContext = createContext();
const API_URL = "http://localhost:4000";

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      const response = await fetch(`${API_URL}/me/favorites`, { credentials: "include" });
      if (!response.ok) return setFavoritos([]);
      const data = await response.json();
      setFavoritos(Array.isArray(data) ? data : []);
    };
    carregar().catch(() => setFavoritos([]));
    window.addEventListener("livraria:user-changed", carregar);
    return () => window.removeEventListener("livraria:user-changed", carregar);
  }, []);

  async function adicionarFavorito(book) {
    const response = await fetch(`${API_URL}/me/favorites`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookId: book.id }) });
    if (!response.ok) throw new Error("Nao foi possivel favoritar o livro.");
    const salvo = await response.json();
    setFavoritos(prev => prev.some(b => b.id === salvo.id) ? prev : [...prev, salvo]);
  }

  async function removerFavorito(id) {
    await fetch(`${API_URL}/me/favorites/${id}`, { method: "DELETE", credentials: "include" });
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
