import React from "react";
import { Route, BrowserRouter} from 'react-router-dom';
import Home from "./Home";
import CarrinhoView from "./Carrinho";
import AdminInterface from "./AdminView";

const Routes = () => {
    return(
        <BrowserRouter>
            <Route Component = { Home } path="/" />
            <Route Component = { CarrinhoView } path="/Carrinho" />
            <Route Component={ AdminInterface } path="/Admin" />
        </BrowserRouter>
    )
}

export default Routes;