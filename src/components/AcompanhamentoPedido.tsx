import { statusPedido, usePedido } from "../contexts/PedidoContext";

export default function AcompanhamentoPedido() {
  const { pedido, atualizarStatusPedido, cancelarPedido } = usePedido();

  if (!pedido) {
    return (
      <section className="order-tracking">
        <h3>Acompanhamento do Pedido</h3>
        <p>Nenhum pedido em acompanhamento no momento.</p>
      </section>
    );
  }

  const statusAtual = pedido.statusAtual;
  const podeCancelar = statusAtual <= 1;

  return (
    <section className="order-tracking">
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

      <label className="order-status-control">
        Status do pedido:
        <select
          value={statusAtual}
          onChange={(event) => atualizarStatusPedido(Number(event.target.value))}
        >
          {statusPedido.map((status, index) => (
            <option key={status.titulo} value={index}>
              {index} - {status.titulo}
            </option>
          ))}
        </select>
      </label>

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
        <button type="button" onClick={cancelarPedido}>
          Cancelar Pedido
        </button>
      )}
    </section>
  );
}
