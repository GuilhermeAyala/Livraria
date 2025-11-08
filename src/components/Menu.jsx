import React from 'react';
import { useNavigate } from "react-router-dom";

const Menu = () => {
    const navigate = useNavigate();

    const EnterFavoritos = () => {
        navigate('/user/Favoritos');
    }

    return(
        <div>
            <ul style={{display: 'flex', listStyle: 'none'}}>
                <li>Lista de Livros</li>
                <li>
                    <button style={{backgroundColor: 'red'}}>Carrinho</button>
                </li>
                <li>
                    <button style={{backgroundColor: 'yellow'}} onClick={EnterFavoritos}>Favoritos</button>
                </li>
            </ul>
        </div>
    );
}

export default Menu;