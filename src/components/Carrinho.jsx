import React from 'react';
import { DetalheDaCompra } from '../data/books';
import { ListaCarrinho } from '../data/carrinho';

function ShowCarrinho(){
    return(
        <div>
            <h2>Carrinho de Compras</h2>
            <h4>Seja bem vindo ao seu carrinho de compras!</h4>
                <p>Seus produtos de compra são: </p>
                <p>{DetalheDaCompra}</p>
                <button>Finalizar Compra</button>
                <button>Continuar Comprando</button>
    </div>
    );
}

export default ShowCarrinho;