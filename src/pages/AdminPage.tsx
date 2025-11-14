import React from "react";
import { useLocation } from "react-router-dom"; 
import AdminInterface from '../components/AdminView';

const AdminPage = () => {
    const location = useLocation();
    const nome = location.state?.nome || "Visitante";

    return(
        <div>
            <h1>Página do Adm</h1>
            <h2>Seja bem vindo, {nome}</h2>
            <AdminInterface/>
        </div>
    )
    
}

export default AdminPage;