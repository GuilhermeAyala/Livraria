import React from 'react';
import CarrinhoView from './Carrinho';

const Menu = () => {
    return(
        <div>
            <ul style={{display: 'flex', listStyle: 'none'}}>
                <li>Lista de Livros</li>
                <li>
                    <button style={{backgroundColor: 'red'}}>Carrinho</button>
                </li>
                <li>
                    <button style={{backgroundColor: 'yellow'}}>Favoritos</button>
                </li>
                <li>Teste</li>
            </ul>
        </div>
    );
}

export default Menu;