import React from "react";
import { useFavoritos } from "../contexts/FavoritosContext";
import { useCarrinho } from "../contexts/CarrinhoContext";

const Favoritos = () => {
  const { favoritos, removerFavorito } = useFavoritos();
  const { adicionarAoCarrinho } = useCarrinho();

  function adicionarFavoritoAoCarrinho(book: any) {
    adicionarAoCarrinho({
      ...book,
      year: book.year ?? 0,
      isAvailable: book.isAvailable ?? true,
    });
  }

  return (
    <div>
      <h2>Favoritos</h2>
      {favoritos.length === 0 ? (
        <p>Você ainda não adicionou favoritos.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {favoritos.map((book: any) => (
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
                  type="button"
                  onClick={() => adicionarFavoritoAoCarrinho(book)}
                  style={{ borderRadius: 6, padding: "6px 8px", marginRight: 8, backgroundColor: "#d8cdbc", color: "#16130f", border: "none", cursor: "pointer" }}
                >
                  Adicionar ao carrinho
                </button>
                <button
                  type="button"
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
