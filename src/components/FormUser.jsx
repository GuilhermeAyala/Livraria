import React from 'react';

function FormUser(){
    return(
        <div className="box-form" style={ {color:"white", backgroundColor:"rgb(0, 0, 128)", borderRadius: 10} }>
            <h3>Seja bem vindo!</h3>
            <h6>Coloque suas informações e faça seu cadastro</h6>
                <input type="text" name="nome" id="input-name"/>
                <label htmlFor="nome">Nome</label>
                <input type="email" name="Email" id="input-email"/>
                <label htmlFor="email">Email</label>
                <input type="button" value="Senha" id="input-senha"/>
                <label htmlFor="senha">Senha</label>
                <input type="button" value="Continuar"/>
    </div>
    );
}

export default FormUser;