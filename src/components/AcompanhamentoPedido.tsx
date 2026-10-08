import { useState } from "react";
import { statusPedido } from "../constants/statusPedido";
import { type Pedido, usePedido } from "../contexts/PedidoContext";

function ItensDoPedido({ pedido }: { pedido: Pedido }) {
  if (pedido.itens.length === 0) return null;

  return (
    <section className="order-items" aria-label="Itens comprados">
      <h4>Itens do pedido</h4>
      <ul>
        {pedido.itens.map((item) => (
          <li key={item.id}>
            <span>
              {item.nome}
              <small>R$ {item.valorUnitario.toFixed(2)} cada</small>
            </span>
            <strong>
              {item.quantidade} {item.quantidade === 1 ? "unidade" : "unidades"}
              <small>R$ {(item.valorUnitario * item.quantidade).toFixed(2)}</small>
            </strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AcompanhamentoPedido() {
  const {
    pedidos,
    pedido,
    carregando,
    erro,
    selecionarPedido,
    atualizarPedidos,
    cancelarPedido,
  } = usePedido();
  const [mensagem, setMensagem] = useState("");

  const cancelar = async () => {
    if (!pedido) return;
    try {
      await cancelarPedido(pedido.id);
      setMensagem("Pedido cancelado com sucesso.");
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : "Nao foi possivel cancelar o pedido.");
    }
  };

  if (carregando) {
    return <section className="order-tracking"><p>Carregando pedidos...</p></section>;
  }

  if (!pedido) {
    return (
      <section className="order-tracking">
        <h3>Acompanhamento do Pedido</h3>
        <p>Nenhum pedido em acompanhamento no momento.</p>
        {erro && <p className="auth-error">{erro}</p>}
      </section>
    );
  }

  const statusAtual = pedido.statusAtual;
  const podeCancelar = statusAtual >= 0 && statusAtual <= 3;

  if (pedido.status === "CANCELADO") {
    return (
      <section className="order-tracking">
        <h3>Acompanhamento do Pedido</h3>
        {pedidos.length > 1 && (
          <label>
            Pedido:{" "}
            <select value={pedido.id} onChange={(event) => selecionarPedido(event.target.value)}>
              {pedidos.map((item) => (
                <option key={item.id} value={item.id}>
                  #{item.id} - {new Date(item.criadoEm).toLocaleDateString("pt-BR")}
                </option>
              ))}
            </select>
          </label>
        )}
        <p>Pedido #{pedido.id}</p>
        <p>Este pedido foi cancelado.</p>
        <ItensDoPedido pedido={pedido} />
        <button type="button" onClick={() => void atualizarPedidos()}>Atualizar</button>
      </section>
    );
  }

  return (
    <section className="order-tracking">
      <div>
        {pedidos.length > 1 && (
          <label>
            Pedido:{" "}
            <select value={pedido.id} onChange={(event) => selecionarPedido(event.target.value)}>
              {pedidos.map((item) => (
                <option key={item.id} value={item.id}>
                  #{item.id} - {new Date(item.criadoEm).toLocaleDateString("pt-BR")}
                </option>
              ))}
            </select>
          </label>
        )}
        <button type="button" onClick={() => void atualizarPedidos()}>Atualizar status</button>
      </div>
      <div className="order-tracking__header">
        <div>
          <h3>Acompanhamento do Pedido</h3>
          <p>Pedido #{pedido.id}</p>
          <p>Valor: R$ {pedido.valor.toFixed(2)}</p>
          <p>Pagamento: {pedido.metodoPagamento}</p>
        </div>
        <span className="order-tracking__badge">
          {statusPedido[statusAtual].titulo}
        </span>
      </div>

      <ItensDoPedido pedido={pedido} />

      <ol className="order-timeline">
        {statusPedido.map((status, index) => {
          const concluido = index < statusAtual;
          const atual = index === statusAtual;

          return (
            <li
              key={status.titulo}
              className={[
                "order-timeline__item",
                concluido ? "order-timeline__item--done" : "",
                atual ? "order-timeline__item--current" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="order-timeline__marker" />
              <div className="order-timeline__content">
                <strong>{status.titulo}</strong>
                <p>{status.descricao}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {podeCancelar && (
        <button type="button" onClick={() => void cancelar()}>
          Cancelar Pedido
        </button>
      )}
      {(mensagem || erro) && <p>{mensagem || erro}</p>}
    </section>
  );
}
