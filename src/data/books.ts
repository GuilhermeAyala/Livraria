export class Book {
    id: number;
    name: string;
    autor: string;
    year: number;
    price: number;
    quantidade: number;
    isAvailable: boolean;

    constructor(id: number, name: string, autor: string, year: number, price: number, quantidade: number, isAvailable: boolean){
        this.id = id;
        this.name = name;
        this.autor = autor;
        this.year = year;
        this.price = price;
        this.quantidade = quantidade;
        this.isAvailable = isAvailable;
    }

    getTotal(): number{
        return this.price * this.quantidade;
    }

}

export const books: Book[] = [
    new Book(0, "Crime e Castigo", "Dostoievsky", 1886, 50.00, 2, true),
    new Book(1, "Dom Casmurro", "Machado de Assis", 1800, 32.50, 2, true),
    new Book(2, "Os miseráveis", "Victor Hugo", 1862, 45.00, 1, true),
    new Book(3, "Hamlet", "William Shakespeare", 1623, 42.00, 1, true),
    new Book(4, "O Poderoso Chefão", "Mario Puzo", 196, 20.00, 1, true),
    new Book(5, "1984", "George Orwell", 1949, 45.00, 1, true),
    new Book(6, "O Livro Vermelho", "Mao Tse-Tung", 1954, 23.00, 1, true)
    
]


let desconto, dinheiroDisponivel, pagamento, metodoPagamento, troco, total;

export function AdicionarLivros(...novosLivros: Book[]): Book[]{
    novosLivros.forEach(book =>{
        books.push(book);
    });
    return books;
}

//export function ComprarLivro(total){//sem retorno no console, função auxiliar que retorna o valor total para uso em outras funções
//    total = books.reduce((acc, book) => acc + book.getTotal(), 0);
//    return total;
    
//}

export function DetalheDaCompra(books: Book[]){
    return books.map(book => ({
        name: book.name,
        autor: book.autor,
        price: book.price,
        quantidade: book.quantidade,
        total: book.getTotal()
    }))
}