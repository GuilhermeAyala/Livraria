import { useState } from "react";
import { books } from "../data/books";

const BarraDePesquisa = () => {
    const [texto, setTexto] = useState("");
    const query = texto.trim().toLowerCase();

    const livrosFiltrados =  query ? books.filter((book) => 
        (book.name ?? "").toLowerCase().includes(query)) 
    : [];

    return(
        <div>
            <input type="text" placeholder="Qual livro você procura?" value={texto} onChange={(e) => setTexto(e.target.value)} />
            
            {query && livrosFiltrados.length > 0 && (
                <ul>
                {livrosFiltrados.map((book) => (
                    <li key={book.id}>
                        {book.name} - R$ {book.price}
                    </li>
                ))}
            </ul>
            )}
            
            {query && livrosFiltrados.length === 0 && (
                <p>Nenhum resultado encontrado</p>
            )}
        </div>
    );
}

export default BarraDePesquisa;