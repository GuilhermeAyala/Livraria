import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function LoginForm({ onSubmit }){
    const navigate = useNavigate();
    const [form, setForm] = useState({nome:'', email:'', senha:''});
    const [erro, setErro] = useState('');

    function handleChange(e){
        const {name, value} = e.target;
        setForm((f) => ({...f, [name]: value}));
    }

    function ValidarForm(form){
        if(!form.nome.trim()){
            return 'Nome Obrigatório';
        }
        if(!form.email.includes('@')){
            return 'Email inválido';
        }
        if(form.senha.length > 10){
            return 'Senha deve ter no máximo 10 caracteres';
        }
        return '';
    }

    function handleSubmit(e){
        e.preventDefault();

        const message = ValidarForm(form)
        if(message){
            setErro(message);
            return;
        }

        if (form.email === "@admin"){
            navigate("/admin")
        }
        else if(form.email === "@user"){
            navigate("/user")
        }
        else{
            alert("Digite @admin ou @user");
            return;
        }
       
        setErro('');
        onSubmit?.(form);
        setForm({nome: '', email: '', senha:'' });
}
//separar via formulario, duas paginas, a do adm e do usuario comum, ver isso dps 

    return (
        <form className="box-form" onSubmit={handleSubmit}
        style={ {color: "white", backgroundColor:"rgb(0, 0, 128)", height: 300, borderRadius: 10, 
        justifyContent: "center", alignItems: "center", textAlign: "center", padding: 20} }>
            <h3>Seja bem vindo!</h3>
            <h6>Coloque suas informações e faça seu cadastro</h6>
                <label htmlFor="nome">Nome</label>
                <input style={ {padding: 10, border: "solid", borderRadius: 10} } type="text" name="nome" id="nome" 
                value={form.nome} onChange={handleChange}/> <br />

                <label htmlFor="email">Email</label>
                <input style={ {padding: 10, border: "solid", borderRadius: 10} } type="text" placeholder="Digite @admin ou @user" name="email" id="email"
                value={form.email} onChange={handleChange}/> <br />

                <label htmlFor="senha">Senha</label>
                <input style={ {padding: 10, border: "solid", borderRadius: 10} } type="password" name="senha" id="senha"
                value={form.senha} onChange={handleChange}/> <br /><br />

                <button type="submit" style={{backgroundColor:"ghostwhite", color:"black", padding: 10, width: 150, height: 30, borderRadius: 15}}>Cadastre-se</button>

        </form>
    );
}

export default LoginForm;