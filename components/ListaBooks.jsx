import React from "react"
import { books } from '../books.js'

function ListarLivros(){
    return(
        <div>
            <h1>Livros da Livraria</h1>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        {book.title}
                        {book.autor}
                        {book.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListarLivros();
