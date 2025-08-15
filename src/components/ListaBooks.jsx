import React from "react";
import { books } from "../data/books";

function ListaBooks() {
  return (
    <div>
      <h2>Livros Disponíveis:</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id} style={ {width: 250, height: 220, border: 2, borderStyle: "solid", borderRadius: 10, padding: 5, alignItems: "center"} }>
            <h4>Titulo: {book.name}</h4>  
            <h5>Autor: {book.autor}</h5>
            <h5>Preço: R${book.price}</h5>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaBooks;
