import React from "react";
import { useLocation } from "react-router-dom";
import Menu  from '../components/Menu'
import CarrinhoView from "../components/Carrinho";
//import ListaBooks from "../components/ListaBooks";

const UserPage = () => {
    const location = useLocation();
    const nome = location.state?.nome;

    return(
        <div>
            <h1>Página do Usuário</h1>
            <h2>Seja bem vindo, {nome}</h2>
            <Menu nome={nome}/>
            <CarrinhoView/>
        </div>
    )
    
}

export default UserPage;