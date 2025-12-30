import React, {useState} from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const nome = location.state?.nome;
    const [address, setAddress] = useState('');
    const Logout = () => {
        navigate('/')
    }

    return(
        <div>
            <h2>Olá {nome}!</h2>
            <label htmlFor="">
                Endereço:
                <input type="text" value={address} name="endereco" id="endereco" onChange={e => setAddress(e.target.value)}/>
            </label>
            <br />
            <button onClick={Logout}>LogOut</button>           
        </div>
    );

};

export default Profile;