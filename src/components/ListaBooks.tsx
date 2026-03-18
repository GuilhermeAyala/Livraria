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
      className="flex flex-col justify-between w-56 min-h-52 bg-zinc-800 border border-zinc-600 rounded-2xl p-4 mr-3 shadow-md hover:shadow-zinc-600 transition-shadow">
      <h4 className="text-white font-bold text-sm mb-1 line-clamp-2">Título: {book.name}</h4>
      <h5 className="text-zinc-400 text-xs mb-1">Autor: {book.autor}</h5>
      <h5 className="text-green-400 font-semibold text-sm">Preço: R${book.price.toFixed(2)}</h5>
      <div className="flex flex-col gap-2 mt-3">
          <button
           onClick={() => handleAdicionarLivro(book)}
            className="bg-zinc-600 hover:bg-zinc-500 text-white text-xs rounded-lg py-2 px-3 transition-colors cursor-pointer"
          >
           Adicionar ao Carrinho
         </button>
         <button
           onClick={() => adicionarFavorito(book)}
           className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 text-xs font-semibold rounded-lg py-2 px-3 transition-colors cursor-pointer"
         >
           Favoritar
         </button>
      </div>
      
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
        <div className="flex items-center gap-3">
          <BotaoNavegacao onClick={irParaPaginaAnterior} disabled={!existePaginaAnterior} label="Anterior" >
            {"<"}
          </BotaoNavegacao>
 
          <ul className="flex overflow-hidden list-none p-0 m-0">
            {livrosVisiveis.map((book) => (
              <CardLivro key={book.id} book={book} />
            ))}
          </ul>
 
          <BotaoNavegacao onClick={irParaProximaPagina} disabled={!existePaginaSeguinte} label="Próximo">
            {">"}
          </BotaoNavegacao>
        </div>
      ) : (
        <ul className="flex flex-wrap list-none p-0 m-0 gap-3">
          {books.map((book) => (
            <CardLivro key={book.id} book={book} />
          ))}
        </ul>
      )}
    </div>
  );
}