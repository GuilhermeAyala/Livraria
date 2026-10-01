import { useState } from "react";
import { useLivros } from "../contexts/LivrosContext";
import { useFavoritos } from "../contexts/FavoritosContext";
import { useCarrinho } from "../contexts/CarrinhoContext";

const BarraDePesquisa = () => {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [termoBuscado, setTermoBuscado] = useState("");
  const { livros } = useLivros();
  const { adicionarFavorito } = useFavoritos();
  const { adicionarAoCarrinho } = useCarrinho();

  const buscarLivros = () => {
    const query = texto.trim().toLowerCase();
    setTermoBuscado(query);

    if (!query) {
      setResultados([]);
      return;
    }

    setResultados(
      livros.filter((book) => {
        const nome = (book.name ?? "").toLowerCase();
        const autor = (book.autor ?? "").toLowerCase();
        return nome.includes(query) || autor.includes(query);
      })
    );
  };

  return (
    <div className="search-area">
      <form className="search-bar" onSubmit={(event) => { event.preventDefault(); buscarLivros(); }}>
        <label className="sr-only" htmlFor="book-search">Buscar livros</label>
        <input
          id="book-search"
          type="search"
          placeholder="Buscar por titulo ou autor"
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
        />
        <button className="search-bar__button" type="submit">Buscar</button>
      </form>

      {termoBuscado && (
        <section className="search-results" aria-live="polite">
          <div className="search-results__header">
            <div>
              <p className="search-results__eyebrow">Resultados da busca</p>
              <h2>Livros encontrados</h2>
            </div>
            <span className="search-results__count">
              {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
            </span>
          </div>

          {resultados.length > 0 ? (
            <ul className="search-results__list">
              {resultados.map((book) => (
                <li key={book.id} className="search-result-card">
                  <div className="search-result-card__content">
                    <p className="search-result-card__label">Livro</p>
                    <h3>{book.name}</h3>
                    <p className="search-result-card__author">{book.autor}</p>
                    <p className="search-result-card__price">R$ {book.price.toFixed(2)}</p>
                  </div>
                  <div className="search-result-card__actions">
                    <button className="search-result-card__cart" type="button" onClick={() => adicionarAoCarrinho(book)}>
                      Adicionar ao carrinho
                    </button>
                    <button className="search-result-card__favorite" type="button" onClick={() => adicionarFavorito(book)}>
                      Favoritar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-results__empty">
              <strong>Nenhum livro encontrado</strong>
              <p>Tente buscar pelo título ou pelo nome do autor.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default BarraDePesquisa;
