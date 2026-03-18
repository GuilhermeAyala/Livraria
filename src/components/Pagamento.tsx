import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { MetodoPagamento, aplicarDesconto, gerarCodigoBarras, DESCONTOS } from "../models/pagamento";

const Pagamento = () => {
    const location = useLocation();
    const subtotalInicial: number = location.state?.subtotal || 0;

    const [valorFinal, setValorFinal] = useState(subtotalInicial);
    const [codigoBarras, setCodigoBarras] = useState("");
    const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>("");

    const handlePagamento = (e: React.ChangeEvent<HTMLInputElement>) => {
        const metodo = e.target.id as MetodoPagamento;
        setMetodoPagamento(metodo);
        setCodigoBarras("");
        setValorFinal(aplicarDesconto(subtotalInicial, metodo));

        if(metodo === "Boleto"){
           setCodigoBarras(gerarCodigoBarras());
        }
        
    };

    const desconto = DESCONTOS[metodoPagamento];

    return (
    <div style={{ padding: 16 }}>
      <h2>Pagamento</h2>
 
      <form>
        <label>
          <input type="radio" name="metodo" id="Credito" onChange={handlePagamento} />
          {" "}Crédito ({(DESCONTOS["Credito"] * 100)}% de desconto)
        </label>
        <br />
        <label>
          <input type="radio" name="metodo" id="Dinheiro" onChange={handlePagamento} />
          {" "}Dinheiro
        </label>
        <br />
        <label>
          <input type="radio" name="metodo" id="Boleto" onChange={handlePagamento} />
          {" "}Boleto
        </label>
      </form>
 
      {metodoPagamento && desconto > 0 && (
        <p>Desconto aplicado: {desconto * 100}%</p>
      )}
 
      <h5>Valor: R$ {valorFinal.toFixed(2)}</h5>
 
      {metodoPagamento === "Boleto" && codigoBarras && (
        <h4>Código de barras: {codigoBarras}</h4>
      )}
    </div>
  );
}

export default Pagamento;