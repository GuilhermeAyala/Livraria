import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useLivros } from "../contexts/LivrosContext";
import { statusPedido, usePedido } from "../contexts/PedidoContext";
import { Book } from "../models/booksModel";

type AdminTab = "adicionar" | "lista" | "estoque" | "pedido" | "financeiro";

type LivroForm = {
  name: string;
  autor: string;
  year: string;
  price: string;
  quantity: string;
  isAvailable: boolean;
};

const formInicial: LivroForm = {
  name: "",
  autor: "",
  year: "",
  price: "",
  quantity: "",
  isAvailable: true,
};

const abasAdmin: { id: AdminTab; label: string }[] = [
  { id: "adicionar", label: "Adicionar livro" },
  { id: "lista", label: "Lista de livros" },
  { id: "estoque", label: "Estoque" },
  { id: "pedido", label: "Status do pedido" },
  { id: "financeiro", label: "Dashboard financeiro" },
];

function livroParaForm(livro: Book): LivroForm {
  return {
    name: livro.name,
    autor: livro.autor,
    year: String(livro.year),
    price: String(livro.price),
    quantity: String(livro.quantity),
    isAvailable: livro.isAvailable,
  };
}

function normalizarLivro(form: LivroForm) {
  return {
    name: form.name.trim(),
    autor: form.autor.trim(),
    year: Number(form.year),
    price: Number(form.price),
    quantity: Number(form.quantity),
    isAvailable: form.isAvailable,
  };
}

function AdminPage() {
  const location = useLocation();
  const nome = location.state?.nome;
  const { livros, adicionarLivro, editarLivro, excluirLivro } = useLivros();
  const { pedido, atualizarStatusPedido, cancelarPedido } = usePedido();
  const [formAdicionar, setFormAdicionar] = useState<LivroForm>(formInicial);
  const [livroEmEdicao, setLivroEmEdicao] = useState<Book | null>(null);
  const [formEditar, setFormEditar] = useState<LivroForm>(formInicial);
  const [abaAtiva, setAbaAtiva] = useState<AdminTab>("adicionar");
  const [mensagem, setMensagem] = useState("");

  const handleFormAdicionar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormAdicionar((formAtual) => ({
      ...formAtual,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormEditar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormEditar((formAtual) => ({
      ...formAtual,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validarForm = (form: LivroForm) => {
    if (!form.name.trim() || !form.autor.trim()) {
      return "Preencha nome e autor do livro.";
    }

    if (Number(form.year) <= 0 || Number.isNaN(Number(form.year))) {
      return "Informe um ano valido.";
    }

    if (Number(form.price) < 0 || Number.isNaN(Number(form.price))) {
      return "Informe um preco valido.";
    }

    if (Number(form.quantity) < 0 || Number.isNaN(Number(form.quantity))) {
      return "Informe uma quantidade valida.";
    }

    return "";
  };

  const cadastrarLivro = async (event: React.FormEvent) => {
    event.preventDefault();
    const erro = validarForm(formAdicionar);

    if (erro) {
      setMensagem(erro);
      return;
    }

    try {
      await adicionarLivro(normalizarLivro(formAdicionar));
      setFormAdicionar(formInicial);
      setMensagem("Livro adicionado com sucesso.");
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : "Nao foi possivel adicionar o livro.");
    }
  };

  const abrirEdicao = (livro: Book) => {
    setAbaAtiva("lista");
    setLivroEmEdicao(livro);
    setFormEditar(livroParaForm(livro));
    setMensagem("");
  };

  const salvarEdicao = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!livroEmEdicao) return;

    const erro = validarForm(formEditar);

    if (erro) {
      setMensagem(erro);
      return;
    }

    try {
      await editarLivro(livroEmEdicao.id, normalizarLivro(formEditar));
      setLivroEmEdicao(null);
      setFormEditar(formInicial);
      setMensagem("Livro editado com sucesso.");
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : "Nao foi possivel editar o livro.");
    }
  };

  const removerLivro = async (livro: Book) => {
    const confirmou = window.confirm(`Excluir "${livro.name}" da lista de livros?`);

    if (!confirmou) return;

    try {
      await excluirLivro(livro.id);
      setLivroEmEdicao(null);
      setMensagem("Livro excluido com sucesso.");
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : "Nao foi possivel excluir o livro.");
    }
  };

  const totalEstoque = livros.reduce((total, livro) => total + livro.quantity, 0);
  const valorEmEstoque = livros.reduce(
    (total, livro) => total + livro.price * livro.quantity,
    0
  );

  return (
    <div className="admin-page">
      <h2>Painel Administrativo</h2>
      <p>Seja bem vindo, {nome || "admin"}.</p>

      <nav className="admin-tabs" aria-label="Navegacao do painel administrativo">
        {abasAdmin.map((aba) => (
          <button
            key={aba.id}
            type="button"
            className={abaAtiva === aba.id ? "admin-tab admin-tab--active" : "admin-tab"}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {aba.label}
          </button>
        ))}
      </nav>

      {abaAtiva === "adicionar" && (
      <section className="admin-section">
        <h1>Formulario para adicionar livro</h1>
        <form onSubmit={cadastrarLivro} className="admin-form">
          <input name="name" placeholder="Nome do livro" value={formAdicionar.name} onChange={handleFormAdicionar} />
          <input name="autor" placeholder="Autor" value={formAdicionar.autor} onChange={handleFormAdicionar} />
          <input name="year" type="number" placeholder="Ano" value={formAdicionar.year} onChange={handleFormAdicionar} />
          <input name="price" type="number" step="0.01" placeholder="Preco" value={formAdicionar.price} onChange={handleFormAdicionar} />
          <input name="quantity" type="number" placeholder="Quantidade" value={formAdicionar.quantity} onChange={handleFormAdicionar} />
          <label className="admin-checkbox">
            <input name="isAvailable" type="checkbox" checked={formAdicionar.isAvailable} onChange={handleFormAdicionar} />
            Disponivel
          </label>
          <button type="submit">Adicionar Livro</button>
        </form>
        {mensagem && <p>{mensagem}</p>}
      </section>
      )}

      {abaAtiva === "lista" && (
      <section className="admin-section">
        <h1>Lista de livros</h1>
        <p>Use o botao editar em cada linha para abrir o formulario de edicao.</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Livro</th>
              <th>Autor</th>
              <th>Ano</th>
              <th>Preco</th>
              <th>Qtd</th>
              <th>Disponivel</th>
              <th>Acao</th>
            </tr>
          </thead>
          <tbody>
            {livros.map((livro) => (
              <tr key={livro.id}>
                <td>{livro.id}</td>
                <td>{livro.name}</td>
                <td>{livro.autor}</td>
                <td>{livro.year}</td>
                <td>R$ {livro.price.toFixed(2)}</td>
                <td>{livro.quantity}</td>
                <td>{livro.isAvailable ? "Sim" : "Nao"}</td>
                <td>
                  <button type="button" onClick={() => abrirEdicao(livro)}>Editar</button>
                  {" "}
                  <button type="button" onClick={() => removerLivro(livro)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      )}

      {abaAtiva === "estoque" && (
      <section className="admin-section">
        <h1>Estoque</h1>
        <div className="admin-stock-grid">
          <strong>Total de titulos: {livros.length}</strong>
          <strong>Total de unidades: {totalEstoque}</strong>
          <strong>Valor em estoque: R$ {valorEmEstoque.toFixed(2)}</strong>
        </div>
        <table>
          <thead>
            <tr>
              <th>Livro</th>
              <th>Quantidade</th>
              <th>Preco unitario</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {livros.map((livro) => (
              <tr key={livro.id}>
                <td>{livro.name}</td>
                <td>{livro.quantity}</td>
                <td>R$ {livro.price.toFixed(2)}</td>
                <td>R$ {livro.getTotal().toFixed(2)}</td>
                <td>{livro.isAvailable ? "Disponivel" : "Indisponivel"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      )}

      {abaAtiva === "pedido" && (
      <section className="admin-section">
        <h1>Status do pedido</h1>
        {!pedido ? (
          <p>Nenhum pedido feito no momento.</p>
        ) : (
          <div className="admin-order-status">
            <p>Pedido #{pedido.id}</p>
            <p>Valor: R$ {pedido.valor.toFixed(2)}</p>
            <p>Pagamento: {pedido.metodoPagamento}</p>
            <label>
              Status:
              <select value={pedido.statusAtual} onChange={(event) => atualizarStatusPedido(Number(event.target.value))}>
                {statusPedido.map((status, index) => (
                  <option key={status.titulo} value={index}>
                    {index} - {status.titulo}
                  </option>
                ))}
              </select>
            </label>
            {pedido.statusAtual <= 1 && (
              <button type="button" onClick={cancelarPedido}>Cancelar Pedido</button>
            )}
          </div>
        )}
      </section>
      )}

      {abaAtiva === "financeiro" && (
      <section className="admin-section">
        <h1>Dashboard financeiro</h1>
        <p>Area reservada para implementacao futura.</p>
      </section>
      )}

      {livroEmEdicao && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h3>Editar Livro</h3>
            <form onSubmit={salvarEdicao} className="admin-form">
              <input name="name" placeholder="Nome do livro" value={formEditar.name} onChange={handleFormEditar} />
              <input name="autor" placeholder="Autor" value={formEditar.autor} onChange={handleFormEditar} />
              <input name="year" type="number" placeholder="Ano" value={formEditar.year} onChange={handleFormEditar} />
              <input name="price" type="number" step="0.01" placeholder="Preco" value={formEditar.price} onChange={handleFormEditar} />
              <input name="quantity" type="number" placeholder="Quantidade" value={formEditar.quantity} onChange={handleFormEditar} />
              <label className="admin-checkbox">
                <input name="isAvailable" type="checkbox" checked={formEditar.isAvailable} onChange={handleFormEditar} />
                Disponivel
              </label>
              <div>
                <button type="submit">Salvar Edicao</button>
                <button type="button" onClick={() => setLivroEmEdicao(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
