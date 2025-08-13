// Carrinho.js
import { ComprarLivro, DetalheDaCompra, FazerPagamento } from './books.js';

export class Carrinho {
    constructor(books = []) {
        this.books = books;
    }

    adicionarLivro(book) {
        this.books.push(book);
    }

    calcularTotal() {
        return ComprarLivro(this.books);
    }

    //detalheDaCompra() {
    //    return DetalheDaCompra(this.books);
    //}

    detalheDaCompra() {
    return this.itens.map(item => ({
      nome: item.nome,
      valor: item.valor,
      quantidade: item.quantidade,
      subtotal: item.subtotal
    }));
  }

    finalizarPagamento(metodoPagamento, dinheiroDisponivel = 0) {
        return FazerPagamento(this.books, metodoPagamento, dinheiroDisponivel);
    }
}

export { Carrinho };
export { adicionarLivro, calcularTotal, detalheDaCompra, finalizarPagamento };