import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Carrinho } from "../data/carrinho.js";
import { useCarrinho } from "../contexts/CarrinhoContext.jsx";

export default function CarrinhoView() {
  const navigate = useNavigate();
  const { livrosNoCarrinho, alterarQuantidade, removerDoCarrinho } = useCarrinho();

  const carrinho = useMemo(() => new Carrinho(livrosNoCarrinho), [livrosNoCarrinho]);
  const detalhes = useMemo(() => carrinho.detalheDaCompra(), [carrinho]);

  const subtotal = livrosNoCarrinho.reduce(
    (acc, b) => acc + (Number(b.price) || 0) * (Number(b.quantidade) || 0),
    0
  );

  const finalizar = () => {
    const resultado = carrinho.finalizarPagamento("Dinheiro", 300);
    if (resultado?.sucesso) {
      alert(
        `Compra finalizada! Método: ${resultado.metodoPagamento} | Total: ${resultado.total} | Troco: ${resultado.troco ?? 0}`
      );
    } else {
      alert("A compra não pode ser finalizada.");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>🛍 Carrinho</h1>
      {livrosNoCarrinho.length === 0 ? (
        <p>Carrinho Vazio</p>
      ) : (
        <>
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Preço</th>
                <th>Qtd</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {livrosNoCarrinho.map((book) => (
                <tr key={book.id}>
                  <td>{book.name}</td>
                  <td>{book.autor}</td>
                  <td>R$ {Number(book.price).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={book.quantidade}
                      onChange={(e) => alterarQuantidade(book.id, e.target.value)}
                      style={{ width: 60 }}
                    />
                  </td>
                  <td>R$ {(book.price * book.quantidade).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removerDoCarrinho(book.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }}>
            <strong>Subtotal: R$ {subtotal.toFixed(2)}</strong>
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              style={{ width: 200, height: 50, backgroundColor: "red", borderRadius: 10, color: "white" }}
              onClick={finalizar}
            >
              Finalizar compra
            </button>
            <button
              style={{ width: 200, height: 50, backgroundColor: "orange", borderRadius: 10, color: "white" }}
              onClick={() => navigate("/user/Pagamento", { state: { subtotal } })}
            >
              Tela Pagamento
            </button>
          </div>
        </>
      )}
    </div>
  );
}
