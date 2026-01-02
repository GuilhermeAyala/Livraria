import React from 'react';
import { useNavigate } from "react-router-dom";
import BarraDePesquisa from './BarraDePesquisa';

const Menu = ({nome = ''}) => {
    const navigate = useNavigate();

    const EnterCarrinho = () => {
        navigate('/user/Carrinho');
    }

    const EnterFavoritos = () => {
        navigate('/user/Favoritos');
    }

    const EnterPerfil = () => {
        navigate('/user/Profile', {state: {nome}});
    }

    return(
        <div>
            <ul style={{display: 'flex', listStyle: 'none', gap: 8}}>

                <li><BarraDePesquisa/> </li>

                <li>
                    <button style={{backgroundColor: 'red'}} onClick={EnterCarrinho}>Carrinho</button>
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