import React from 'react';
import { useNavigate } from "react-router-dom";
import BarraDePesquisa from './BarraDePesquisa';

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
            <ul style={{display: 'flex', listStyle: 'none', gap: 8}}>
                <li>Lista de Livros</li>

                <select style={{backgroundColor: 'grey', padding: 4, borderRadius: 6}}>Categorias
                <option>Ficção</option>
                <option>Romance</option>
                <option>Filosofia</option>
                <option>História</option>
                </select>

                <li><BarraDePesquisa/> </li>

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