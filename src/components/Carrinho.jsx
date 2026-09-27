import React from "react";
import { useNavigate } from "react-router-dom";
import { useCarrinho } from "../contexts/CarrinhoContext.jsx";

export default function CarrinhoView() {
  const navigate = useNavigate();
  const { livrosNoCarrinho, alterarQuantidade, removerDoCarrinho } = useCarrinho();

  const subtotal = livrosNoCarrinho.reduce(
    (acc, book) => acc + (Number(book.price) || 0) * (Number(book.quantidade) || 0),
    0
  );

  const irParaPagamento = () => {
    navigate("/user/Pagamento", { state: { subtotal } });
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Carrinho</h1>
      {livrosNoCarrinho.length === 0 ? (
        <p>Carrinho vazio</p>
      ) : (
        <>
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Autor</th>
                <th>Preco</th>
                <th>Qtd</th>
                <th>Total</th>
                <th>Acoes</th>
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
                      onChange={(event) => alterarQuantidade(book.id, event.target.value)}
                      style={{ width: 60 }}
                    />
                  </td>
                  <td>R$ {(book.price * book.quantidade).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      style={{ backgroundColor: "red", padding: 1.5, width: 100 }}
                      onClick={() => removerDoCarrinho(book.id)}
                    >
                      Remover
                    </button>
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
              type="button"
              style={{ width: 200, height: 50, backgroundColor: "red", borderRadius: 10, color: "white" }}
              onClick={irParaPagamento}
            >
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
