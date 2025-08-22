import React, { useMemo, useState } from 'react';
import { Carrinho } from '../data/carrinho.js';
import { books } from '../data/books.js';

export default function CarrinhoView() {
  const carrinho = useMemo(() => new Carrinho(books), []);
  const [, setTick] = useState(0); // só para forçar re-render quando mudamos quantidades/removemos
  const forceUpdate = () => setTick((v) => v + 1);

  const handleQtdChange = (id, qtd) => {
    const item = carrinho.books.find((b) => b.id === id);
    if (!item) return;
    item.quantidade = Math.max(0, Number(qtd) || 0); // atualiza direto o objeto existente
    forceUpdate();
  };

  const handleRemover = (id) => {
    const idx = carrinho.books.findIndex((b) => b.id === id);
    if (idx >= 0) {
      carrinho.books.splice(idx, 1); // remove do mesmo array (mantém compatibilidade com suas funções)
      forceUpdate();
    }
  };

  const detalhes = useMemo(() => carrinho.detalheDaCompra(), [carrinho, /* re-render */]);
  const subtotal = carrinho.books.reduce(
    (acc, b) => acc + (Number(b.price) || 0) * (Number(b.quantidade) || 0),
    0
  );
    [detalhes]

  const finalizar = () => {
    const resultado = carrinho.finalizarPagamento('Dinheiro', 300);
    if (resultado?.sucesso) {
      alert(`Compra finalizada! Método: ${resultado.metodoPagamento} | Total: ${resultado.total} | Troco: ${resultado.troco ?? 0}`);
    } else {
      alert('A compra não pode ser finalizada.');
    }
  };

  if (!carrinho.books || carrinho.books.length === 0) {
    return <p>🛒 Seu carrinho está vazio.</p>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>🛍 Carrinho</h2>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
          {carrinho.books.map((book) => (
            <tr key={book.id}>
              <td>{book.name}</td>
              <td>{book.autor}</td>
              <td>R$ {Number(book.price).toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={book.quantidade}
                  onChange={(e) => handleQtdChange(book.id, e.target.value)}
                  style={{ width: 60 }}
                />
              </td>
              <td>R$ {Number(book.getTotal()).toFixed(2)}</td>
              <td>
                <button onClick={() => handleRemover(book.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        <strong>Subtotal: R$ {subtotal.toFixed(2)}</strong>
      </div>

      <div style={{ marginTop: 12}}>
        <button style={{width: 200, height: 50, backgroundColor: "red", borderRadius: 10, color:"white"}} onClick={finalizar}>Finalizar compra</button>
      </div>
    </div>
  );
}
