import React from "react";
import { ComprarLivro } from "../data/books";
//continuar depois

const Pagamento = () => {
    let metodoPagamento;
    let total = ComprarLivro(total); 

    GerarChavePix = () => {
        let chavePix = 0;
        min = Math.ceil(min);
        max = Math.floor(max);
        chavePix = Math.random();
            if(chavePix < 0){
                return false;
            }
            else if(chavePix > 10000){
                return false
            }
    }

    if(metodoPagamento === "Credito"){
        total = total * (total - 0.20);
    }
    else if(metodoPagamento === "Pix"){

    }

    return(
        <div>
            <form>
                <label htmlFor="">
                    <input type="radio" name="CartãoDeCredito" id="Credito" />
                    Credito
                </label>
                <label htmlFor="">
                    <input type="radio" name="Dinheiro" id="Dinheiro" />
                    Dinheiro
                </label>
                <label htmlFor="">
                    <input type="radio" name="Pix" id="Pix" />
                </label>
            </form>
            
        </div>
    )
}

export default Pagamento;