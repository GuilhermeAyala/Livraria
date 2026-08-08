import { PrismaClient } from "@prisma/client";

export class BooksRepository {
    findAll(): Books[]{
        return this.books
    }

    findById(id: number): book | undefined {
        return this.books.find(book => book.id === id)
    }

    create(data: Omit<Book, "id">): Book {
        const newBook: Book = {
            id: this.currentId++,
            ...data
        };

        this.books.push(newBook);
        return newBook;
    }

    update(id:number, data: Partial<Omit<Book, "id">>): Book | null{
        const book = this.findById(id);

        if(!book){
            return null;
        }

        Object.assign(book, data);
        return book
    }

    delete(id: number): boolean {
        const index = this.books.findIndex(book => book.id === id);

        if(id === -1){
            return false;
        }

        this.books.splice(index, 1);
        return true;
    }
}