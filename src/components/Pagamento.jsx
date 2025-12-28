import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Pagamento = () => {
    const location = useLocation();
    let chavePix = 0;
    let subtotal = location.state?.subtotal || 0;
    let [metodoPagamento, setMetodoPagamento] = useState();

    const GerarChavePix = () => {
        let chavePix;
        let nums = [0,1,2,3,4,5,6,7,8,9];
        let chars = ['abcdefghijklmnopqrstuvwxyz'];
        chavePix = Math.random(nums);
        return chavePix;
        
    }

    const handlePagamento = (e) => {
        setMetodoPagamento(e.target.id);
    }

    if(metodoPagamento === "Credito"){
        subtotal = subtotal - (subtotal * 0.20);
        return subtotal;
    }
    else if(metodoPagamento === "Pix"){
        return subtotal;
    }

    return(
        <div>
            <form>
                <label htmlFor="">
                    <input type="radio" name="metodo" id="Credito" onChange={handlePagamento}/>
                    Credito
                </label>
                <label htmlFor="">
                    <input type="radio" name="metodo" id="Dinheiro" onChange={handlePagamento}/>
                    Dinheiro
                </label>
                <label htmlFor="">
                    <input type="radio" name="metodo" id="Pix" onChange={handlePagamento}/>
                </label>

                <h5>Valor: {subtotal.toFixed(2)}</h5>
            </form>

            {GerarChavePix ? (
                <h4>Sua chave é: {chavePix}</h4>
            ) : (
                <h4>Chave Pix não gerada, tente outro metodo de pagamento</h4>
            )}
            
        </div>
    )
}

export default Pagamento;