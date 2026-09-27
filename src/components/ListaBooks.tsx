import React, { useMemo, useState } from "react";
import { Book } from "../models/booksModel";
import { useFavoritos } from "../contexts/FavoritosContext";
import { useLivros } from "../contexts/LivrosContext";

type Props = {
  books?: Book[];
  handleAdicionarLivro: (book: Book) => void;
};

const QUANTIDADE_POR_VEZ = 5;

export default function ListaBooks({ books = [], handleAdicionarLivro }: Props) {
  const { adicionarFavorito } = useFavoritos();
  const { avaliarLivro } = useLivros();
  const [inicio, setInicio] = useState(0);
  const [avaliandoId, setAvaliandoId] = useState<number | null>(null);
  const [erroAvaliacao, setErroAvaliacao] = useState("");

  const totalDeLivros = books.length;
  const usarCarrossel = totalDeLivros > QUANTIDADE_POR_VEZ;

  const livrosVisiveis = useMemo(() => {
    if (!usarCarrossel) return books;
    return books.slice(inicio, Math.min(inicio + QUANTIDADE_POR_VEZ, totalDeLivros));
  }, [inicio, usarCarrossel, books, totalDeLivros]);

  const avaliar = async (book: Book, rating: number) => {
    setAvaliandoId(book.id);
    setErroAvaliacao("");

    try {
      await avaliarLivro(book.id, rating);
    } catch (error) {
      setErroAvaliacao(error instanceof Error ? error.message : "Nao foi possivel registrar a avaliacao.");
    } finally {
      setAvaliandoId(null);
    }
  };

  const CardLivro = ({ book }: { book: Book }) => (
    <li
      key={book.id}
      className="flex flex-col justify-between w-56 min-h-52 bg-zinc-800 border border-zinc-600 rounded-2xl p-4 mr-3 shadow-md hover:shadow-zinc-600 transition-shadow"
    >
      <div>
        <h4 className="text-white font-bold text-sm mb-1 line-clamp-2">Titulo: {book.name}</h4>
        <h5 className="text-zinc-400 text-xs mb-1">Autor: {book.autor}</h5>
        <h5 className="text-green-400 font-semibold text-sm">Preco: R${book.price.toFixed(2)}</h5>
        <p className="text-yellow-300 text-xs mt-2">
          Media: {book.averageRating === null ? "Sem avaliacoes" : `${book.averageRating.toFixed(2)} / 5`}
          {book.ratingCount > 0 ? ` (${book.ratingCount})` : ""}
        </p>
        <p className="text-zinc-400 text-xs mt-1">
          Sua nota: {book.myRating === null ? "Ainda nao avaliado" : `${book.myRating} / 5`}
        </p>
        <div className="book-rating" role="group" aria-label={`Avaliar ${book.name}`}>
          <div className="book-rating__header">
            <span>Escolha sua nota</span>
            <span>0 a 5</span>
          </div>
          <div className="book-rating__options">
            {[0, 1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                disabled={avaliandoId === book.id}
                onClick={() => avaliar(book, rating)}
                aria-label={`Dar nota ${rating}`}
                className={`rating-option ${book.myRating === rating ? "rating-option--selected" : ""}`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <button
          type="button"
          onClick={() => handleAdicionarLivro(book)}
          className="bg-zinc-600 hover:bg-zinc-500 text-white text-xs rounded-lg py-2 px-3 transition-colors cursor-pointer"
        >
          Adicionar ao Carrinho
        </button>
        <button
          type="button"
          onClick={() => adicionarFavorito(book)}
          className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 text-xs font-semibold rounded-lg py-2 px-3 transition-colors cursor-pointer"
        >
          Favoritar
        </button>
      </div>
    </li>
  );

  const BotaoNavegacao = ({ onClick, disabled, label, children }: {
    onClick: () => void;
    disabled: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{ width: 36, height: 36, borderRadius: 6, border: "none", background: !disabled ? "#666" : "#ccc", color: "#fff", cursor: !disabled ? "pointer" : "not-allowed", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {children}
    </button>
  );

  const existePaginaAnterior = inicio > 0;
  const existePaginaSeguinte = inicio + QUANTIDADE_POR_VEZ < totalDeLivros;

  return (
    <div>
      <h4>Livros Disponiveis:</h4>
      {erroAvaliacao && <p className="text-red-400 text-sm mb-2">{erroAvaliacao}</p>}
      {totalDeLivros === 0 ? <p>Nenhum livro encontrado.</p> : usarCarrossel ? (
        <div className="flex items-center gap-3">
          <BotaoNavegacao onClick={() => setInicio(Math.max(0, inicio - QUANTIDADE_POR_VEZ))} disabled={!existePaginaAnterior} label="Anterior">{"<"}</BotaoNavegacao>
          <ul className="flex overflow-hidden list-none p-0 m-0">{livrosVisiveis.map((book) => <CardLivro key={book.id} book={book} />)}</ul>
          <BotaoNavegacao onClick={() => setInicio(Math.min(totalDeLivros - QUANTIDADE_POR_VEZ, inicio + QUANTIDADE_POR_VEZ))} disabled={!existePaginaSeguinte} label="Proximo">{">"}</BotaoNavegacao>
        </div>
      ) : (
        <ul className="flex flex-wrap list-none p-0 m-0 gap-3">{books.map((book) => <CardLivro key={book.id} book={book} />)}</ul>
      )}
    </div>
  );
}
