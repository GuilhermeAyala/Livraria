import React from 'react';

const Menu = () => {
    return(
        <div>
            <ul style={{display: 'flex', listStyle: 'none'}}>
                <li>Lista de Livros</li>
                <li>
                    <button style={{backgroundColor: 'red'}}>Carrinho</button>
                </li>
                <li>Teste</li>
            </ul>
        </div>
    );
}

export default Menu;