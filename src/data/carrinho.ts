import { Book } from "../models/booksModel";
import { Pagamentos, metodoPagamento } from "../models/pagamento";

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

export type DetalheDaCompra = {
  id: number;
  name: string;
  autor: string;
  quantidade: number;
  price: number;
  total: number;
};

export function calcularTotal(books: BookNoCarrinho[]): number {
  return books.reduce((acc, book) => {
    return acc + book.price * book.quantidade;
  }, 0);
}

export function detalheDaCompra(books: BookNoCarrinho[]): DetalheDaCompra[] {
  return books.map((book) => ({
    id: book.id,
    name: book.name,
    autor: book.autor,
    quantidade: book.quantidade,
    price: book.price,
    total: book.price * book.quantidade,
  }));
}
 
export class Carrinho {
  books: BookNoCarrinho[];
 
  constructor(books: BookNoCarrinho[] = []) {
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
    return calcularTotal(this.books);
  }
 
  detalheDaCompra(): DetalheDaCompra[] {
    return detalheDaCompra(this.books);
  }
 
  finalizarPagamento(escolha: Pagamentos | string, dinheiroDisponivel: number = 0) {
    const total = this.calcularTotal();
    const valorFinal = typeof escolha === "string" ? total : metodoPagamento(escolha, total);
    const troco = dinheiroDisponivel > valorFinal ? dinheiroDisponivel - valorFinal : 0;
    
    return {
      sucesso: true,
      metodoPagamento: escolha,
      total: valorFinal.toFixed(2),
      troco: troco.toFixed(2),
      detalhes: this.detalheDaCompra(),
    };
  }
}
