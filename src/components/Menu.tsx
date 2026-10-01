import React from 'react';
import { useNavigate } from "react-router-dom";
import BarraDePesquisa from './BarraDePesquisa';
import { useAuth } from '../contexts/AuthContext';

const Menu = () => {
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();

    const EnterCarrinho = () => {
        navigate('/user/Carrinho');
    }

    const EnterFavoritos = () => {
        navigate('/user/Favoritos');
    }

    const EnterPerfil = () => {
        navigate('/user/Profile');
    }

    const sair = async () => {
        await logout();
        navigate('/');
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
                    <button style={{backgroundColor: 'lightblue'}} onClick={EnterPerfil}>Perfil de {usuario?.name}</button>
                </li>
                <li>
                    <button onClick={sair}>Sair</button>
                </li>
            </ul>
        </div>
    );
}

export default Menu;
