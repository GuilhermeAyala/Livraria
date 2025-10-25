import React from "react";
import Menu  from '../components/Menu'
import CarrinhoView from "../components/Carrinho";
//import ListaBooks from "../components/ListaBooks";

const UserPage = () => {
    return(
        <div>
            <h1>Página do Usuário</h1>
            <Menu/>
            <CarrinhoView/>
        </div>
    )
    
}

export default UserPage;