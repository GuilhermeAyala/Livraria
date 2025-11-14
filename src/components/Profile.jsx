import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const nome = location.state?.nome;
    const Logout = () => {
        navigate('/')
    }

    return(
        <div>
            <h2>Olá {nome}!</h2>
            <button onClick={Logout}>LogOut</button>
        </div>
    );

};

export default Profile;