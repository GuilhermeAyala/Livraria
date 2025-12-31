import React, { useState, useMemo } from "react";
import { books } from "../data/books";
import { useFavoritos } from "../contexts/FavoritosContext";

export default function ListaBooks({books = [], handleAdicionarLivro }) {
  const { adicionarFavorito } = useFavoritos();

  const QUANTIDADE_POR_VEZ = 5;
  const totalDeLivros = books.length;
  const [inicio, setInicio] = useState(0);
  const usarCarrossel = totalDeLivros > QUANTIDADE_POR_VEZ;

  const livrosVisiveis = useMemo(() => {
    if (!usarCarrossel) return books;
    return books.slice(inicio, Math.min(inicio + QUANTIDADE_POR_VEZ, totalDeLivros));
  }, [inicio, usarCarrossel, totalDeLivros]);

  const existePaginaAnterior = inicio > 0;
  const existePaginaSeguinte = inicio + QUANTIDADE_POR_VEZ < totalDeLivros;

  function irParaPaginaAnterior() {
    if (!existePaginaAnterior) return;
    setInicio(Math.max(0, inicio - QUANTIDADE_POR_VEZ));
  }

  function irParaProximaPagina() {
    if (!existePaginaSeguinte) return;
    setInicio(Math.min(totalDeLivros - QUANTIDADE_POR_VEZ, inicio + QUANTIDADE_POR_VEZ));
  }

  return (
    <div>
      <h4>Livros Disponíveis:</h4>

      {usarCarrossel ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            aria-label="Anterior"
            onClick={irParaPaginaAnterior}
            disabled={!existePaginaAnterior}
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              border: "none",
              background: existePaginaAnterior ? "#666" : "#ccc",
              color: "#fff",
              cursor: existePaginaAnterior ? "pointer" : "not-allowed",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {"<"}
          </button>

          <ul style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, overflow: "hidden" }}>
            {livrosVisiveis.map((book) => (
              <li
                key={book.id}
                style={{
                  width: 250,
                  height: 220,
                  border: 2,
                  borderStyle: "solid",
                  borderRadius: 10,
                  padding: 5,
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <h4>Titulo: {book.name}</h4>
                <h5>Autor: {book.autor}</h5>
                <h5>Preço: R${book.price.toFixed(2)}</h5>

                <button
                  onClick={() => handleAdicionarLivro(book)}
                  style={{ borderRadius: 10, padding: 8, backgroundColor: "grey", marginRight: 6 }}
                >
                  Adicionar ao Carrinho
                </button>

                <button
                  onClick={() => adicionarFavorito(book)}
                  style={{ borderRadius: 10, padding: 8, backgroundColor: "yellow" }}
                >
                  Favoritar
                </button>
              </li>
            ))}
          </ul>

          <button
            aria-label="Próximo"
            onClick={irParaProximaPagina}
            disabled={!existePaginaSeguinte}
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              border: "none",
              background: existePaginaSeguinte ? "#666" : "#ccc",
              color: "#fff",
              cursor: existePaginaSeguinte ? "pointer" : "not-allowed",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {">"}
          </button>
        </div>
      ) : (
        <ul style={{ display: "flex", listStyle: "none" }}>
          {books.map((book) => (
            <li
              key={book.id}
              style={{
                width: 250,
                height: 220,
                border: 2,
                borderStyle: "solid",
                borderRadius: 10,
                padding: 5,
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <h4>Titulo: {book.name}</h4>
              <h5>Autor: {book.autor}</h5>
              <h5>Preço: R${book.price.toFixed(2)}</h5>

              <button
                onClick={() => handleAdicionarLivro(book)}
                style={{ borderRadius: 10, padding: 8, backgroundColor: "grey", marginRight: 6 }}
              >
                Adicionar ao Carrinho
              </button>

              <button
                onClick={() => adicionarFavorito(book)}
                style={{ borderRadius: 10, padding: 8, backgroundColor: "yellow" }}
              >
                Favoritar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}