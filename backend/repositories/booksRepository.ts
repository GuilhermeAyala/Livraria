import { Book } from "../models/books";

export type BookCreateData = Omit<Book, "id" | "getTotal">;
export type BookUpdateData = Partial<BookCreateData>;

const livrosIniciais: Book[] = [
  new Book(1, "Crime e Castigo", "Dostoievsky", 1886, 50.0, 2, true),
  new Book(2, "Dom Casmurro", "Machado de Assis", 1800, 32.5, 2, true),
  new Book(3, "Os miseraveis", "Victor Hugo", 1862, 45.0, 1, true),
  new Book(4, "Hamlet", "William Shakespeare", 1623, 42.0, 1, true),
  new Book(5, "O Poderoso Chefao", "Mario Puzo", 1969, 20.0, 1, true),
  new Book(6, "1984", "George Orwell", 1949, 45.0, 1, true),
  new Book(7, "O Livro Vermelho", "Mao Tse-Tung", 1954, 23.0, 1, true),
];

export class BooksRepository {
  private books: Book[] = [...livrosIniciais];
  private currentId = livrosIniciais.length + 1;

  findAll(): Book[] {
    return [...this.books];
  }

  findById(id: number): Book | undefined {
    return this.books.find((book) => book.id === id);
  }

  create(data: BookCreateData): Book {
    const newBook = new Book(
      this.currentId++,
      data.name,
      data.autor,
      data.year,
      data.price,
      data.quantidade,
      data.isAvailable
    );

    this.books.push(newBook);
    return newBook;
  }

  update(id: number, data: BookUpdateData): Book | null {
    const book = this.findById(id);

    if (!book) {
      return null;
    }

    Object.assign(book, data);
    return book;
  }

  delete(id: number): boolean {
    const index = this.books.findIndex((book) => book.id === id);

    if (index === -1) {
      return false;
    }

    this.books.splice(index, 1);
    return true;
  }
}
