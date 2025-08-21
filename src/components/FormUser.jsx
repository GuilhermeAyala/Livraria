import React, { useState } from 'react';

function FormUser({ onSubmit }){
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
        e.preventDefault();;
        const message = ValidarForm(form)
        if(message){
            setErro(message)
        }
        setErro('');
        onSubmit?.(form);
        setForm({ nome:'', email:'', senha:''});
    }
    
    return (
        <form className="box-form" onSubmit={handleSubmit}
        style={ {color:"white", backgroundColor:"rgb(0, 0, 128)", height: 150 , borderRadius: 10} }>
            <h3>Seja bem vindo!</h3>
            <h6>Coloque suas informações e faça seu cadastro</h6>
                <label htmlFor="nome">Nome</label>
                <input type="text" name="nome" id="nome" 
                value={form.nome} onChange={handleChange}/>

                <label htmlFor="email">Email</label>
                <input type="text" name="email" id="email"
                value={form.email} onChange={handleChange}/>

                <label htmlFor="senha">Senha</label>
                <input type="password" name="senha" id="senha"
                value={form.senha} onChange={handleChange}/>

                <button type="submit" style={{backgroundColor:"ghostwhite", color:"black", padding: 8, width: 120, height: 25, borderRadius: 15}}>Cadastre-se</button>
        </form>
    );
}

export default FormUser;