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

    detalheDaCompra() {
        return DetalheDaCompra(this.books);
    }

    finalizarPagamento(metodoPagamento, dinheiroDisponivel = 0) {
    const desconto = metodoPagamento === "Cartão de Crédito" ? 0.1 : 0;
    const total = this.books.reduce((acc, book) => acc + book.valor * book.quantidade, 0);
    const pagamento = total * (1 - desconto);
    const troco = metodoPagamento === "Dinheiro" ? dinheiroDisponivel - pagamento : 0;

    return FazerPagamento(this.books, desconto, dinheiroDisponivel, pagamento, metodoPagamento, troco, total);
}

}

export { Carrinho };