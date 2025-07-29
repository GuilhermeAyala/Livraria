import { AdicionarLivro, DetalheDaCompra, FazerPagamento} from '.books.js'
import Books from './books.js';

class Carrinho extends Books{
    constructor(id, name, price, quantidade){
        super(id, name, price, quantidade);
            this.id = id;
            this.name = name;
            this.price = price;
            this.quantidade = quantidade
    }
}

//console.log(Carrinho);

let ListaCarrinho = [Books[itens]];
console.log(ListaCarrinho);

DetalheDaCompra();

//continuar depois
// A ideia é consegur adicionar ao carrinho os produtos, seus valores calculados, com nome, id e etc 