import { Book } from "../models/booksModel";
import { calcularTotal, detalheDaCompra } from "../api/booksApi";
import { DESCONTOS } from "../models/pagamento";

export type BookNoCarrinho = {
  id: number;
  name: string;
  autor: string;
  year: number;
  price: number;
  isAvailable: boolean;
  quantidade: number;
}

export function bookParaCarrinho(book: Book, quantidade = 1): BookNoCarrinho {
  return {
    id: book.id,
    name: book.name,
    autor: book.autor,
    year: book.year,
    price: book.price,
    isAvailable: book.isAvailable,
    quantidade,
  };
}
 
export class Carrinho {
  books: BookNoCarrinho[];
 
  constructor(books: Book[] = []) {
    this.books = Array.isArray(books) ? books : [];
  }
 
  adicionarLivro(book: Book): void {
    const existente = this.books.find((b) => b.id === book.id);
    if (existente) {
      existente.quantidade += 1;
    } else {
      this.books.push(bookParaCarrinho(book));
    }
  }
 
  calcularTotal(): number {
    return this.books.reduce((acc, b) => acc + b.price * b.quantidade, 0);
  }
 
  detalheDaCompra() {
    return detalheDaCompra(this.books);
  }
 
  finalizarPagamento(metodoPagamento: string, dinheiroDisponivel: number = 0) {
    const desconto = DESCONTOS[metodoPagamento] ?? 0;
    const total = this.calcularTotal();
    const pagamento = total * (1 - desconto);
    const troco = metodoPagamento === "Dinheiro" ? dinheiroDisponivel - pagamento : 0;
 
    if (metodoPagamento === "Dinheiro" && dinheiroDisponivel < pagamento) {
      return { sucesso: false };
    }
 
    return {
      sucesso: true,
      metodoPagamento,
      total: pagamento.toFixed(2),
      troco: troco > 0 ? troco.toFixed(2) : 0,
    };
  }
}
