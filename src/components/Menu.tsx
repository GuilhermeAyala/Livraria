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
        <nav className="main-menu" aria-label="Navegação principal">
            <ul className="main-menu__list">
                <li className="main-menu__brand">Livraria</li>

                <li className="main-menu__search"><BarraDePesquisa/> </li>

                <li className="main-menu__actions">
                    <button className="main-menu__button" onClick={EnterCarrinho}>Carrinho</button>

                    <button className="main-menu__button main-menu__button--secondary" onClick={EnterFavoritos}>Favoritos</button>
                    <button className="main-menu__button main-menu__button--secondary main-menu__profile" onClick={EnterPerfil}>Perfil de {usuario?.name}</button>
                    <button className="main-menu__button main-menu__button--quiet" onClick={sair}>Sair</button>
                </li>
            </ul>
        </nav>
    );
}

export default Menu;
