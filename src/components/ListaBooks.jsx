import React from "react";
import { books } from "../data/books";

export default function ListaBooks({ handleAdicionarLivro }) {
  return (
    <div>
      <h4>Livros Disponíveis:</h4>
      <ul style={ {display:"flex", listStyle: "none"} }>
        {books.map((book) => (
          <li key={book.id} style={ {width: 250, height: 220, border: 2, borderStyle: "solid", borderRadius: 10, padding: 5, alignItems: "center"} }>
            <h4>Titulo: {book.name}</h4>  
            <h5>Autor: {book.autor}</h5>
            <h5>Preço: R${book.price.toFixed(2)}</h5>
            <button  onClick={() => {
              handleAdicionarLivro(book)} } style={{borderRadius: 10, padding: 8, backgroundColor: "grey"}}>Adicionar ao Carrinho</button>
          </li>
        ))}
      </ul>
    </div>
  );
}