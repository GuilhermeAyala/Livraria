import React, { useState, useMemo } from "react";
import { Book } from "../models/booksModel";
import { useFavoritos } from "../contexts/FavoritosContext";
 
type Props = {
  books?: Book[];
  handleAdicionarLivro: (book: Book) => void;
};
 
const QUANTIDADE_POR_VEZ = 5;
 
export default function ListaBooks({ books = [], handleAdicionarLivro }: Props) {
  const { adicionarFavorito } = useFavoritos();
  const [inicio, setInicio] = useState(0);
 
  const totalDeLivros = books.length;
  const usarCarrossel = totalDeLivros > QUANTIDADE_POR_VEZ;
 
  const livrosVisiveis = useMemo(() => {
    if (!usarCarrossel) return books;
    return books.slice(inicio, Math.min(inicio + QUANTIDADE_POR_VEZ, totalDeLivros));
  }, [inicio, usarCarrossel, books, totalDeLivros]);
 
  const existePaginaAnterior = inicio > 0;
  const existePaginaSeguinte = inicio + QUANTIDADE_POR_VEZ < totalDeLivros;
 
  const irParaPaginaAnterior = () => {
    if (!existePaginaAnterior) return;
    setInicio(Math.max(0, inicio - QUANTIDADE_POR_VEZ));
  };
 
  const irParaProximaPagina = () => {
    if (!existePaginaSeguinte) return;
    setInicio(Math.min(totalDeLivros - QUANTIDADE_POR_VEZ, inicio + QUANTIDADE_POR_VEZ));
  };
 
  const CardLivro = ({ book }: { book: Book }) => (
    <li
      key={book.id}
      style={{
        width: 250,
        height: 220,
        border: "2px solid",
        borderRadius: 10,
        padding: 5,
        marginRight: 8,
      }}
    >
      <h4>Título: {book.name}</h4>
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
  );
 
  const BotaoNavegacao = ({
    onClick,
    disabled,
    label,
    children,
  }: {
    onClick: () => void;
    disabled: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 36,
        height: 36,
        borderRadius: 6,
        border: "none",
        background: !disabled ? "#666" : "#ccc",
        color: "#fff",
        cursor: !disabled ? "pointer" : "not-allowed",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
 
  return (
    <div>
      <h4>Livros Disponíveis:</h4>
 
      {usarCarrossel ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BotaoNavegacao onClick={irParaPaginaAnterior} disabled={!existePaginaAnterior} label="Anterior">
            {"<"}
          </BotaoNavegacao>
 
          <ul style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, overflow: "hidden" }}>
            {livrosVisiveis.map((book) => (
              <CardLivro key={book.id} book={book} />
            ))}
          </ul>
 
          <BotaoNavegacao onClick={irParaProximaPagina} disabled={!existePaginaSeguinte} label="Próximo">
            {">"}
          </BotaoNavegacao>
        </div>
      ) : (
        <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
          {books.map((book) => (
            <CardLivro key={book.id} book={book} />
          ))}
        </ul>
      )}
    </div>
  );
}