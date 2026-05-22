import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Pagamentos, metodoPagamento, gerarCodigoBarras} from "../models/pagamento";

const Pagamento = () => {
    const location = useLocation();
    const subtotalInicial: number = location.state?.subtotal || 0;

    const [valorFinal, setValorFinal] = useState(subtotalInicial);
    const [codigoBarras, setCodigoBarras] = useState("");
    const [escolha, setEscolha] = useState<Pagamentos | null>(null);

    const handlePagamento = (e: React.ChangeEvent<HTMLInputElement>) => {
        const escolha = Number(e.target.value) as Pagamentos;
        setEscolha(escolha);
        setCodigoBarras("");
        setValorFinal(metodoPagamento(escolha, subtotalInicial));

        if(escolha === Pagamentos.Boleto){
           setCodigoBarras(gerarCodigoBarras());
        }
        
    };

    const temDesconto = escolha === Pagamentos.Credito
        ? 20
        : (escolha === Pagamentos.Pix || escolha === Pagamentos.Boleto)
        ? 15
        : 0;

    return (
    <div style={{ padding: 16 }}>
      <h2>Pagamento</h2>
 
      <form>
        <label>
          <input type="radio" name="escolha" id="Credito" value={Pagamentos.Credito} onChange={handlePagamento} />
          {" "}Crédito (20% de desconto)
        </label>
        <br />
        <label>
          <input type="radio" name="escolha" id="Debito" value={Pagamentos.Debito} onChange={handlePagamento} />
          {" "}Débito
        </label>
        <br />
        <label>
          <input type="radio" name="escolha" value={Pagamentos.Pix} onChange={handlePagamento} />
          {" "}Pix (15% de desconto)
        </label>
        <br />
        <label>
          <input type="radio" name="escolha" id="Boleto" value={Pagamentos.Boleto} onChange={handlePagamento} />
          {" "}Boleto(15% de desconto)
        </label>
      </form>
 
      {temDesconto > 0 && (
        <p>Desconto aplicado: {temDesconto}%</p>
      )}
 
      <h5>Valor: R$ {valorFinal.toFixed(2)}</h5>
 
      {escolha === Pagamentos.Boleto && codigoBarras && (
        <h4>Código de barras: {codigoBarras}</h4>
      )}
    </div>
  );
}

//variável escolha, substituiu o metodoPagamento, ela quem define como será pago

export default Pagamento;