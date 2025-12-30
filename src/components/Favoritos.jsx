import React from "react";
import { useFavoritos } from "./FavoritosContext";

const Favoritos = ({books = [], handleAdicionarLivro }) => {
  const { favoritos, removerFavorito } = useFavoritos();

  return (
    <div>
      <h2>Favoritos</h2>
      {favoritos.length === 0 ? (
        <p>Você ainda não adicionou favoritos.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {favoritos.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#060606ff",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold", color: "white" }}>{book.name}</div>
                <div>Autor: {book.autor}</div>
                <div>Preço: R${book.price.toFixed(2)}</div>
              </div>
              <div>
                <button
                  onClick={() => removerFavorito(book.id)}
                  style={{ borderRadius: 6, padding: "6px 8px", backgroundColor: "#f44336", color: "#fff", border: "none", cursor: "pointer" }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;