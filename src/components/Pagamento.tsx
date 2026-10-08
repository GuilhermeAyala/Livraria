import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagamentos, metodoPagamento} from "../models/pagamento";
import { useCartoes } from "../contexts/CartoesContext";
import { usePedido } from "../contexts/PedidoContext";
import { useCarrinho } from "../contexts/CarrinhoContext";

const Pagamento = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const subtotalInicial: number = location.state?.subtotal || 0;
    const { cartoes } = useCartoes();
    const { criarPedido } = usePedido();
    const { livrosNoCarrinho, limparCarrinho } = useCarrinho();

    const [valorFinal, setValorFinal] = useState(subtotalInicial);
    const [codigoBarras, setCodigoBarras] = useState("");
    const [escolha, setEscolha] = useState<Pagamentos | null>(null);
    const [cartaoSelecionado, setCartaoSelecionado] = useState<number | null>(null);
    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [compraConcluida, setCompraConcluida] = useState(false);

    const subtotalAtual = livrosNoCarrinho.reduce(
      (total, book) => total + Number(book.price) * Number(book.quantidade),
      0
    );
    const subtotalCompra = subtotalAtual > 0 ? subtotalAtual : subtotalInicial;

    const handlePagamento = (e: React.ChangeEvent<HTMLInputElement>) => {
        const escolha = Number(e.target.value) as Pagamentos;
        setEscolha(escolha);
        setCodigoBarras("");
        setCartaoSelecionado(null);
        setValorFinal(metodoPagamento(escolha, subtotalCompra));
        
    };

    const temDesconto = escolha === Pagamentos.Credito
        ? 20
        : (escolha === Pagamentos.Pix || escolha === Pagamentos.Boleto)
        ? 15
        : 0;

    const cartoesFiltrados = cartoes.filter((c) =>
      escolha === Pagamentos.Credito ? c.tipo === "Credito" : c.tipo === "Debito"
    );

    const nomeMetodoPagamento = escolha === Pagamentos.Credito
      ? "Credito"
      : escolha === Pagamentos.Debito
      ? "Debito"
      : escolha === Pagamentos.Pix
      ? "Pix"
      : escolha === Pagamentos.Boleto
      ? "Boleto"
      : "";

    const concluirCompra = async () => {
      setMensagem("");
      setSalvando(true);

      if (subtotalCompra <= 0) {
        setMensagem("Nao existe compra para concluir.");
        setSalvando(false);
        return;
      }

      if (escolha === null) {
        setMensagem("Escolha uma forma de pagamento antes de concluir.");
        setSalvando(false);
        return;
      }

      if (
        (escolha === Pagamentos.Credito || escolha === Pagamentos.Debito) &&
        cartaoSelecionado === null
      ) {
        setMensagem("Selecione um cartao antes de concluir a compra.");
        setSalvando(false);
        return;
      }

      try {
        const pedido = await criarPedido({
          paymentMethod: nomeMetodoPagamento.toUpperCase() as "CREDITO" | "DEBITO" | "PIX" | "BOLETO",
        });
        setValorFinal(pedido.valor);
        setCodigoBarras(pedido.codigoBarras ?? "");
        limparCarrinho();
        setCompraConcluida(true);
        setMensagem(`Compra concluida. Pedido ${pedido.id} criado para acompanhamento.`);
      } catch (error) {
        setMensagem(error instanceof Error ? error.message : "Nao foi possivel criar o pedido.");
      } finally {
        setSalvando(false);
      }
    };

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

      {(escolha === Pagamentos.Credito || escolha === Pagamentos.Debito) && (
            <div style={{ marginTop: 12 }}>
                  <h4>Selecione o cartão:</h4>
                  {cartoesFiltrados.length === 0 ? (
                      <p style={{ color: "gray" }}>
                          Nenhum cartão de {escolha === Pagamentos.Credito ? "crédito" : "débito"} cadastrado.
                          Adicione um no seu perfil.
                      </p>
                  ) : (
                      cartoesFiltrados.map((c, index) => (
                          <label key={index} style={{ display: "block", marginBottom: 8 }}>
                              <input
                                  type="radio"
                                  name="cartao"
                                  value={index}
                                  onChange={() => setCartaoSelecionado(index)}
                              />
                              {" "}{c.cartao.marca} •••• {c.cartao.numeroCartao.slice(-4)} — {c.cartao.nomeTitular}
                          </label>
                      ))
                  )}
              </div>
      )}
 
      {temDesconto > 0 && (
        <p>Desconto aplicado: {temDesconto}%</p>
      )}
 
      <h5>Valor: R$ {valorFinal.toFixed(2)}</h5>
 
      {escolha === Pagamentos.Boleto && codigoBarras && (
        <h4>Código de barras: {codigoBarras}</h4>
      )}

       <button type="button" onClick={concluirCompra} disabled={salvando || compraConcluida}>
         {salvando ? "Processando..." : compraConcluida ? "Compra concluida" : "Concluir compra"}
      </button>

      {mensagem && <p>{mensagem}</p>}

      <button
        type="button"
        onClick={() =>
          navigate("/user/Profile", { state: { mostrarAcompanhamento: true } })
        }
      >
        Acompanhar pedido
      </button>
    </div>
  );
}

//variável escolha, substituiu o metodoPagamento, ela quem define como será pago

export default Pagamento;
