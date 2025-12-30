import { useState } from "react";
import { books } from "../data/books";
import { useFavoritos } from "./FavoritosContext";

const BarraDePesquisa = ({ handleAdicionarLivro }) => {
    const [texto, setTexto] = useState("");
    const [resultados, setResultados] = useState([]);
    const { adicionarFavorito } = useFavoritos();

    const buscarLivros = () => {
        const query = texto.trim().toLowerCase();
        if(!query){
            setResultados([]);
            return;
        }

        const livrosFiltrados = books.filter((book) => 
        (book.name ?? "").toLowerCase().includes(query));

        setResultados(livrosFiltrados);
    }

    //const livrosFiltrados =  query ? books.filter((book) => 
    //    (book.name ?? "").toLowerCase().includes(query)) 
    //: [];

    return(
        <div>
            <input type="text" placeholder="Qual livro você procura?" value={texto} onChange={(e) => setTexto(e.target.value)} />
            <button onClick={buscarLivros}>Buscar</button>
            
            {resultados.length > 0 ? (
                <ul style={{display: "flex", listStyle: "none", padding: 0, marginTop: 12}}>
                  {resultados.map((book) => (
                    <li key={book.id}
                     style={{
                    width: 250,
                    height: 220,
                    border: "2px solid black",
                    borderRadius: 10,
                    padding: 5,
                    marginRight: 8,
                     }}>
                        <h4>Título: {book.name}</h4>
                        <h5>Autor: {book.autor}</h5>
                        <h5>Preço: R${book.price.toFixed(2)}</h5>

                        <button onClick={() => handleAdicionarLivro(book)}
                         style={{ borderRadius: 10, padding: 8, backgroundColor: "grey", marginRight: 6 }}
                        >
                        Adicionar ao Carrinho
                        </button>

                        <button onClick={() => adicionarFavorito(book)}
                        style={{ borderRadius: 10, padding: 8, backgroundColor: "yellow" }}
                        >
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