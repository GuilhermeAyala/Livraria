import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Pagamentos, gerarCodigoBarras, metodoPagamento } from "../models/pagamento";
import { useCartoes } from "../contexts/CartoesContext";
import { criarPedido } from "../api/booksApi";
import { useCarrinho } from "../contexts/CarrinhoContext";

const Pagamento = () => {
  const location = useLocation();
  const subtotalInicial: number = location.state?.subtotal || 0;
  const { cartoes } = useCartoes();
  const { limparCarrinho } = useCarrinho();

  const [valorFinal, setValorFinal] = useState(subtotalInicial);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [escolha, setEscolha] = useState<Pagamentos | null>(null);
  const [cartaoSelecionado, setCartaoSelecionado] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState("");

  const handlePagamento = (e: React.ChangeEvent<HTMLInputElement>) => {
    const escolhaAtual = Number(e.target.value) as Pagamentos;
    setEscolha(escolhaAtual);
    setCodigoBarras("");
    setCartaoSelecionado(null);
    setValorFinal(metodoPagamento(escolhaAtual, subtotalInicial));
    setMensagem("");

    if (escolhaAtual === Pagamentos.Boleto) {
      setCodigoBarras(gerarCodigoBarras());
    }
  };

  const temDesconto =
    escolha === Pagamentos.Credito ? 20 : escolha === Pagamentos.Pix || escolha === Pagamentos.Boleto ? 15 : 0;

  const cartoesFiltrados = cartoes.filter((c) =>
    escolha === Pagamentos.Credito ? c.tipo === "Credito" : c.tipo === "Debito",
  );

  const metodoApi = () => {
    if (escolha === Pagamentos.Credito) return "CREDITO";
    if (escolha === Pagamentos.Debito) return "DEBITO";
    if (escolha === Pagamentos.Pix) return "PIX";
    return "BOLETO";
  };

  const finalizarPedido = async () => {
    if (escolha === null) {
      setMensagem("Escolha uma forma de pagamento.");
      return;
    }

    try {
      const pedido = await criarPedido(metodoApi());
      limparCarrinho();
      setMensagem(`Pedido ${pedido.id} criado com sucesso. Total: R$ ${Number(pedido.total).toFixed(2)}`);
    } catch (e: any) {
      setMensagem(e.message);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Pagamento</h2>

      <form>
        <label>
          <input type="radio" name="escolha" id="Credito" value={Pagamentos.Credito} onChange={handlePagamento} />{" "}
          Credito (20% de desconto)
        </label>
        <br />
        <label>
          <input type="radio" name="escolha" id="Debito" value={Pagamentos.Debito} onChange={handlePagamento} /> Debito
        </label>
        <br />
        <label>
          <input type="radio" name="escolha" value={Pagamentos.Pix} onChange={handlePagamento} /> Pix (15% de desconto)
        </label>
        <br />
        <label>
          <input type="radio" name="escolha" id="Boleto" value={Pagamentos.Boleto} onChange={handlePagamento} /> Boleto
          (15% de desconto)
        </label>
      </form>

      {(escolha === Pagamentos.Credito || escolha === Pagamentos.Debito) && (
        <div style={{ marginTop: 12 }}>
          <h4>Selecione o cartao:</h4>
          {cartoesFiltrados.length === 0 ? (
            <p style={{ color: "gray" }}>
              Nenhum cartao de {escolha === Pagamentos.Credito ? "credito" : "debito"} cadastrado. Adicione um no seu
              perfil.
            </p>
          ) : (
            cartoesFiltrados.map((c, index) => (
              <label key={index} style={{ display: "block", marginBottom: 8 }}>
                <input type="radio" name="cartao" value={index} onChange={() => setCartaoSelecionado(index)} />{" "}
                {c.cartao.marca} **** {c.cartao.numeroCartao.slice(-4)} - {c.cartao.nomeTitular}
              </label>
            ))
          )}
        </div>
      )}

      {cartaoSelecionado !== null && <p>Cartao selecionado.</p>}
      {temDesconto > 0 && <p>Desconto aplicado: {temDesconto}%</p>}

      <h5>Valor: R$ {valorFinal.toFixed(2)}</h5>

      {escolha === Pagamentos.Boleto && codigoBarras && <h4>Codigo de barras: {codigoBarras}</h4>}

      <button onClick={finalizarPedido}>Finalizar pedido</button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default Pagamento;
