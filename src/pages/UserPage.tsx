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
        <div className="min-h-screen bg-zinc-900">
            <Menu nome={nome}/>
            <div className="px-6 py-4">
                <h1 className="text-white text=x1 font-semibold mb-1">Página do Usuário</h1>
            </div>
            <h2 className="text-white text=x1 font-semibold mb-1">Seja bem vindo, <span className="text-blue-400">{nome}</span></h2>
            <p className="text-zinc-500 text-sm mb-4">Explore nosso catálogo de livros</p>
            <ListaBooks books = {books} handleAdicionarLivro={adicionarAoCarrinho}/>
        </div>
    )
    
}

export default UserPage;