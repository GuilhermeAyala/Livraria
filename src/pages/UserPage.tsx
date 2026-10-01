import React from "react";
import Menu  from '../components/Menu'
import ListaBooks from "../components/ListaBooks";
import { useCarrinho } from "../contexts/CarrinhoContext";
import { useLivros } from "../contexts/LivrosContext";
import { useAuth } from "../contexts/AuthContext";

const UserPage = () => {
    const { usuario } = useAuth();
    const { adicionarAoCarrinho } = useCarrinho();
    const { livros, carregando, erro } = useLivros();

    return(
        <div className="min-h-screen bg-zinc-900">
            <Menu />
            <div className="px-6 py-4">
                <h1 className="text-white text=x1 font-semibold mb-1">Página do Usuário</h1>
            </div>
            <h2 className="text-white text=x1 font-semibold mb-1">Seja bem vindo, <span className="text-blue-400">{usuario?.name}</span></h2>
            <p className="text-zinc-500 text-sm mb-4">Explore nosso catálogo de livros</p>
            {carregando && <p className="text-white">Carregando livros...</p>}
            {erro && <p className="text-red-400">{erro}</p>}
            {!carregando && !erro && <ListaBooks books={livros} handleAdicionarLivro={adicionarAoCarrinho}/>} 
        </div>
    )
    
}

export default UserPage;
