class Books {
    constructor(id, name, autor, year, price, isAvailable, quantidade){
        this.id = id;
        this.name = name;
        this.autor = autor;
        this.year = year;
        this.price = price;
        this.isAvailable = isAvailable;
        this.quantidade = quantidade;
    }

    getTotal(){
        return this.price * this.quantidade;
    }

}

let Book1 = new Books(0, "Crime e Castigo", "Dostoievsky", 1886, 50.00, true, 2);
let Book2 = new Books(1, "Dom Casmurro", "Machado de Assis", 1800, 32.50, true, 2);
let Book3 = new Books(2, "Os miseráveis", "Victor Hugo", 1862, 45.00, true, 1);

let books = [Book1, Book2, Book3]

function AdicionarLivro(){
    books.push(new Books(3, "Hamlet", "William Shakespeare", 1623, 42.00, true, 1));
    console.log("Livro adicionado com sucesso!");
}

function ComprarLivro(){
    let total = books.reduce((acc, book) => acc + book.getTotal(), 0)
    return total;
}

function DetalheDaCompra(){
    console.log("Descrição da compra:")
    books.forEach(book => {
        console.log(`Nome do livro:${book.name}, Autor:${book.autor}, Valor:${book.price}, Quantidade:${book.quantidade}`)
    });

    console.log(`Valor total: ${ComprarLivro()} reais`)

}

AdicionarLivro();
ComprarLivro();
DetalheDaCompra();
