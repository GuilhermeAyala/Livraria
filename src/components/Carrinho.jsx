import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carrinho } from '../data/carrinho.js';
import { books } from '../data/books.js';
import ListaBooks from './ListaBooks.jsx';

const STORAGE_KEY = 'carrinho'

export default function CarrinhoView() {
  const navigate = useNavigate();
  const carrinho = useMemo(() => new Carrinho([]), []);
  const livrosDisponiveis = books;
  const [livrosNoCarrinho, setLivrosNoCarrinho] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [, setTick] = useState(0); // só para forçar re-render quando mudamos quantidades/removemos
  const forceUpdate = () => setTick((v) => v + 1);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(livrosNoCarrinho))
    } catch{}
  }, [livrosNoCarrinho]);

  const IrParaPagamento = () => {
    navigate('/user/Pagamento')
  }

  const handleAdicionarLivro = (book) => {
  setLivrosNoCarrinho((prev) => {
    const existe = prev.find((b) => b.id === book.id);
    if (existe) {
      return prev.map((b) =>
        b.id === book.id ? { ...b, quantidade: b.quantidade + 1 } : b
      );
    } else {
      return [...prev, { ...book, quantidade: 1 }];
    }
  });
};


  const handleQtdChange = (id, qtd) => {
    setLivrosNoCarrinho((prev) => 
      prev.map((b) =>
        b.id === id ? {...b, quantidade: Math.max(0, Number(qtd) || 0)} : b
      )
    );
  };

  const handleRemover = (id) => {
    setLivrosNoCarrinho((prev) => prev.filter((b) => b.id !== id));
    };

  carrinho.books = livrosNoCarrinho;
  const detalhes = useMemo(() => carrinho.detalheDaCompra(), [carrinho, /* re-render */]);
  const subtotal = (livrosNoCarrinho || []).reduce(
    (acc, b) => acc + (Number(b.price) || 0) * (Number(b.quantidade) || 0),
    0
  );
    [detalhes]

  const finalizar = () => {
    const total = livrosNoCarrinho.reduce(
      (acc, b) => acc + (Number(b.price) || 0) * (Number(b.quantidade) || 0),
      0
    );
    
    const resultado = carrinho.finalizarPagamento('Dinheiro', 300);
    if (resultado?.sucesso) {
      alert(`Compra finalizada! Método: ${resultado.metodoPagamento} | Total: ${resultado.total} | Troco: ${resultado.troco ?? 0}`);
    } else {
      alert('A compra não pode ser finalizada.');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      
      <ListaBooks books={livrosDisponiveis} handleAdicionarLivro={handleAdicionarLivro} />

    <h1>🛍 Carrinho</h1>

    {livrosNoCarrinho.length === 0 ? (
      <p>Carrinho Vazio</p>
    ) : (
     <>
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
                  onChange={(e) => handleQtdChange(book.id, e.target.value)}
                  style={{ width: 60 }}
                />
              </td>
              <td>R$ {(book.price * book.quantidade).toFixed(2)}</td>
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
        <button style={{width: 200, height: 50, backgroundColor: "orange", borderRadius: 10, color:"white"}} onClick={IrParaPagamento}>Teste Tela Pagamento</button>
      </div>
        </>
      )}
    </div>
  )

};