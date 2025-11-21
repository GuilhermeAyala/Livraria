import React from 'react';
import { useNavigate } from "react-router-dom";

const Menu = ({nome = ''}) => {
    const navigate = useNavigate();

    const EnterFavoritos = () => {
        navigate('/user/Favoritos');
    }

    const EnterPerfil = () => {
        navigate('/user/Profile', {state: {nome}});
    }

    return(
        <div>
            <ul style={{display: 'flex', listStyle: 'none'}}>
                <li>Lista de Livros</li>

                <select style={{backgroundColor: 'grey'}}>Categorias
                <option>Ficção</option>
                <option>Romance</option>
                <option>Filosofia</option>
                <option>História</option>
                </select>

                <li>
                    <button style={{backgroundColor: 'red'}}>Carrinho</button>
                </li>
                <li>
                    <button style={{backgroundColor: 'yellow'}} onClick={EnterFavoritos}>Favoritos</button>
                </li>
                <li>
                    <button style={{backgroundColor: 'lightblue'}} onClick={EnterPerfil}>Ver Perfil</button>
                </li>
            </ul>
        </div>
    );
}

export default Menu;