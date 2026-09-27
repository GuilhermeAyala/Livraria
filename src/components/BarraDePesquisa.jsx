import { useState } from "react";
import { useLivros } from "../contexts/LivrosContext";
import { useFavoritos } from "../contexts/FavoritosContext";
import { useCarrinho } from "../contexts/CarrinhoContext";

const BarraDePesquisa = () => {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const { livros } = useLivros();
  const { adicionarFavorito } = useFavoritos();
  const { adicionarAoCarrinho } = useCarrinho();

  const buscarLivros = () => {
    const query = texto.trim().toLowerCase();
    if (!query) {
      setResultados([]);
      return;
    }

    setResultados(livros.filter((book) => (book.name ?? "").toLowerCase().includes(query)));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Qual livro voce procura?"
        value={texto}
        onChange={(event) => setTexto(event.target.value)}
        style={{ padding: 5, borderRadius: 5, border: "1px solid black" }}
      />
      <button type="button" onClick={buscarLivros} style={{ padding: 5, backgroundColor: "whitesmoke" }}>
        Buscar
      </button>

      {resultados.length > 0 ? (
        <ul style={{ display: "flex", listStyle: "none", padding: 0, marginTop: 12 }}>
          {resultados.map((book) => (
            <li key={book.id} style={{ width: 250, height: 220, border: "2px solid black", borderRadius: 10, padding: 5, marginRight: 8 }}>
              <h4>Titulo: {book.name}</h4>
              <h5>Autor: {book.autor}</h5>
              <h5>Preco: R${book.price.toFixed(2)}</h5>
              <button type="button" onClick={() => adicionarAoCarrinho(book)} style={{ borderRadius: 10, padding: 8, backgroundColor: "grey", marginRight: 6 }}>
                Adicionar ao Carrinho
              </button>
              <button type="button" onClick={() => adicionarFavorito(book)} style={{ borderRadius: 10, padding: 8, backgroundColor: "yellow" }}>
                Favoritar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        texto && <p>Nenhum resultado encontrado</p>
      )}
    </div>
  );
};

export default BarraDePesquisa;
