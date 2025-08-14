import React, { useState } from 'react';
import { Carrinho } from '../data/carrinho';
import { Books } from '../data/books';

const ShowCarrinho = () => {
    const [metodoPagamento, setMetodoPagamento] = useState("Dinheiro");
    const [dinheiroDisponivel, setDinheiroDisponivel] = useState(300);
    const carrinho = new Carrinho([
        new Books(0, "Crime e Castigo", "Dostoievsky", 1886, 50.00, true, 2),
        new Books(1, "Dom Casmurro", "Machado de Assis", 1800, 32.50, true, 2),
        new Books(2, "Os Miseráveis", "Victor Hugo", 1862, 45.00, true, 1)
    ]);

    const detalheCompra = carrinho.detalheDaCompra();
    const resultadoPagamento = carrinho.finalizarPagamento(metodoPagamento, dinheiroDisponivel);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>🛒 Carrinho de Compras</h2>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Livro</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {detalheCompra.map((book, index) => (
                        <tr key={index}>
                            <td>{book.nome}</td>
                            <td>R$ {book.valor.toFixed(2)}</td>
                            <td>{book.quantidade}</td>
                            <td>R$ {book.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '20px' }}>
                <label>
                    💳 Método de Pagamento:
                    <select
                        value={metodoPagamento}
                        onChange={(e) => setMetodoPagamento(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    >
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                    </select>
                </label>

                {metodoPagamento === "Dinheiro" && (
                    <div style={{ marginTop: '10px' }}>
                        <label>
                            💵 Dinheiro disponível:
                            <input
                                type="number"
                                value={dinheiroDisponivel}
                                onChange={(e) => setDinheiroDisponivel(Number(e.target.value))}
                                style={{ marginLeft: '10px' }}
                            />
                        </label>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3>🧾 Total da Compra: R$ {resultadoPagamento?.total.toFixed(2)}</h3>
                {metodoPagamento === "Cartão de Crédito" && (
                    <p>💳 Com 10% de desconto: <strong>R$ {resultadoPagamento.pagamentoFinal.toFixed(2)}</strong></p>
                )}
                {metodoPagamento === "Dinheiro" && resultadoPagamento.sucesso && (
                    <>
                        <p>Pagamento: <strong>R$ {resultadoPagamento.pagamentoFinal.toFixed(2)}</strong></p>
                        <p>Troco: <strong>R$ {resultadoPagamento.troco.toFixed(2)}</strong></p>
                    </>
                )}
                {!resultadoPagamento.sucesso && (
                    <p style={{ color: 'red' }}>❌ {resultadoPagamento.mensagem}</p>
                )}
            </div>
        </div>
    );
    
};

export default ShowCarrinho;