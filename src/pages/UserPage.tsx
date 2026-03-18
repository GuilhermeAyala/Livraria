import React from "react";
import { useLocation } from "react-router-dom";
import Menu  from '../components/Menu'
import ListaBooks from "../components/ListaBooks";
import { books } from "../data/books";
import { useCarrinho } from "../contexts/CarrinhoContext";

const UserPage = () => {
    const location = useLocation();
    const nome = location.state?.nome;
    const { adicionarAoCarrinho } = useCarrinho();

    return(
        <div>
            <h1>Página do Usuário</h1>
            <h2>Seja bem vindo, {nome}</h2>
            <Menu nome={nome}/>
            <ListaBooks books = {books} handleAdicionarLivro={adicionarAoCarrinho}/>
        </div>
    )
    
}

export default UserPage;