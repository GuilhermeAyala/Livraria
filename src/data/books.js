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

let desconto, dinheiroDisponivel, pagamento, metodoPagamento, troco, total;
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
    new Books(5, "1984", "George Orwell", 1949, 45.00, true, 1),
    new Books(6, "O Livro Vermelho", "Mao Tse-Tung", 1954, 23.00, true, 1)
);

export function ComprarLivro(total){//sem retorno no console, função auxiliar que retorna o valor total para uso em outras funções
    total = books.reduce((acc, book) => acc + book.getTotal(), 0);
    return total;
    
}

export function DetalheDaCompra(books) {
  const arr = Array.isArray(books) ? books : [];
  console.log('DetalheDaCompra recebeu', arr.length, 'itens');

  return arr.map((book) => {
    const price = Number(book?.price ?? 0);
    const quantidade = Number(book?.quantidade ?? 0);

    return {
      name: book?.name ?? '',
      autor: book?.autor ?? '',
      price,
      quantidade,
      total: typeof book?.getTotal === 'function'
        ? book.getTotal()
        : price * quantidade
    };
  });
}


export function FazerPagamento(desconto, dinheiroDisponivel, pagamento, metodoPagamento, troco, total){
    total = ComprarLivro(total);
    metodoPagamento = "Dinheiro";

    switch(metodoPagamento){
        case "Cartão de Crédito":
            desconto = 0.10
            pagamento = ComprarLivro(total) - (total * desconto);
            console.log(`O valor total a ser pago é igual a ${pagamento}`);
            break;
        
        case "Dinheiro":
            dinheiroDisponivel = 500;
            pagamento = total
            if(dinheiroDisponivel > total){
                troco = dinheiroDisponivel - total;
                console.log(`O valor total a ser pago é igual a ${pagamento}`);
                console.log(`Seu troco é igual a ${troco}`);
            }
            if(dinheiroDisponivel < total){
                console.log("A compra não pode ser finalizada, dinheiro insuficiente");
                return { sucesso: false};
            }
            break;
    }
    console.log("Compra finalizada!");
    console.log(`Seu método de pagamento é ${metodoPagamento}`);

    return{
        sucesso: true,
        metodoPagamento, 
        total, 
        troco
    };

}

export { books };