import React from "react";
import { Route, BrowserRouter} from 'react-router-dom';
import Home from "./Home";
import CarrinhoView from "./Carrinho";

const Routes = () => {
    return(
        <BrowserRouter>
            <Route Component = { Home } path="/" />
            <Route Component = { CarrinhoView } path="/Carrinho" />
        </BrowserRouter>
    )
}

export default Routes;