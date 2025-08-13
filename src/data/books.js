export class Books {
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

let desconto, dinheiro, pagamento, troco, total;
let Book1 = new Books(0, "Crime e Castigo", "Dostoievsky", 1886, 50.00, true, 2);
let Book2 = new Books(1, "Dom Casmurro", "Machado de Assis", 1800, 32.50, true, 2);
let Book3 = new Books(2, "Os miseráveis", "Victor Hugo", 1862, 45.00, true, 1);

let books = [Book1, Book2, Book3]

export function AdicionarLivros(...novosLivros){
    novosLivros.forEach(book =>{
        books.push(book);
    });

    console.log(`${novosLivros.length} livro(s) adicionados com sucesso!`);
    return books;
}
AdicionarLivros(
    new Books(3, "Hamlet", "William Shakespeare", 1623, 42.00, true, 1),
    new Books(4, "O Poderoso Chefão", "Mario Puzo", 196, 20.00, true, 1),
);

export function ComprarLivro(total){//sem retorno no console, função auxiliar que retorna o valor total para uso em outras funções
    total = books.reduce((acc, book) => acc + book.getTotal(), 0);
    return total;
    
}

export function DetalheDaCompra(){
    console.log("Descrição da compra:")
    books.forEach(book => {
        console.log(`Nome do livro:${book.name}, Autor:${book.autor}, Valor:${book.price}, Quantidade:${book.quantidade}`)
        return books.forEach(book => {
            {book.name}{book.autor}{book.price}{book.quantidade}
        })
    });

    console.log(`Valor total: ${ComprarLivro()} reais`)

}

export function FazerPagamento(desconto, dinheiro, pagamento, troco, total){
    total = ComprarLivro(total);
    pagamento = "Dinheiro";

    switch(pagamento){
        case "Cartão de Crédito":
            desconto = 0.10
            pagamento = ComprarLivro(total) - (total * desconto);
            console.log(`O valor total a ser pago é igual a ${pagamento}`);
            break;
        
        case "Dinheiro":
            dinheiro = 300;
            pagamento = total
            if(dinheiro > total){
                troco = dinheiro - total;
                console.log(`O valor total a ser pago é igual a ${pagamento}`);
                console.log(`Seu troco é igual a ${troco}`);
            }
            if(dinheiro < total){
                console.log("A compra não pode ser finalizada, dinheiro insuficiente");
            }
            break;
    }

    console.log("Compra finalizada!");

}

export { books };
//todas as funções estão funcionado 