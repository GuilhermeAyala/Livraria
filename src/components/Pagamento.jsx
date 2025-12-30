import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Pagamento = () => {
    const location = useLocation();
    let subtotalInicial = location.state?.subtotal || 0;
    let [valorFinal, setValorFinal] = useState(subtotalInicial);
    let [chavePix, setChavePix] = useState("");
    let [metodoPagamento, setMetodoPagamento] = useState("");

    const GerarChavePix = (tamanho = 15) => {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let chavePix = "";
        for(let i = 0; i < tamanho; i++){
                const indice = Math.floor(Math.random() * chars.length);
                chavePix += chars[indice];
            }
        return chavePix;
        
    };

    const handlePagamento = (e) => {
        const metodo = e.target.id;
        setMetodoPagamento(metodo);

        if(metodo === "Credito"){
            setValorFinal(subtotalInicial * 0.8);   
        }
        else if(metodo === "Dinheiro"){
            setValorFinal(subtotalInicial);
        }
        else if(metodo === "Pix"){
            setValorFinal(subtotalInicial);
            setChavePix(GerarChavePix());
        }
    
    };

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
                    Pix
                </label>
            </form>
            
            <h5>Valor: {valorFinal.toFixed(2)}</h5>
            
            {GerarChavePix ? (
                <h4>Sua chave é: {chavePix}</h4>
            ) : (
                <h4>Chave Pix não gerada, tente outro metodo de pagamento</h4>
            )}
            
        </div>
    );
}

export default Pagamento;