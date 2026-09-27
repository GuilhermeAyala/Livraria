import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type EntradaFormData = {
  nome: string;
  email: string;
  senha: string;
};

function EntradaForm({ onSubmit }: { onSubmit?: (form: EntradaFormData) => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState<EntradaFormData>({
    nome: "",
    email: "",
    senha: "",
  });
  const [erro, setErro] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((formAtual) => ({ ...formAtual, [name]: value }));
  }

  function validarForm(dados: EntradaFormData) {
    if (!dados.nome.trim()) {
      return "Nome obrigatorio";
    }
    if (!dados.email.trim()) {
      return "Email obrigatorio";
    }
    if (!dados.senha.trim()) {
      return "Senha obrigatoria";
    }
    return "";
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const message = validarForm(form);
    if (message) {
      setErro(message);
      return;
    }

    if (form.email === "@user") {
      try {
        const response = await fetch("http://localhost:4000/users/demo");
        const usuario = await response.json();
        if (!response.ok) throw new Error(usuario?.message || "Usuario demo nao encontrado.");
        localStorage.setItem("livraria_user_id", String(usuario.id));
        localStorage.setItem("livraria_user_name", form.nome);
        window.dispatchEvent(new Event("livraria:user-changed"));
        navigate("/user", { state: { nome: form.nome, userId: usuario.id } });
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Nao foi possivel entrar.");
        return;
      }
    } else if (form.email === "@admin") {
      localStorage.setItem("livraria_user_id", "1");
      localStorage.setItem("livraria_user_name", form.nome);
      navigate("/admin", { state: { nome: form.nome } });
    } else {
      alert("Digite @admin ou @user");
      return;
    }

    setErro("");
    onSubmit?.(form);
    setForm({ nome: "", email: "", senha: "" });
  }

  return (
    <form className="box-form auth-form" onSubmit={handleSubmit}>
      <h3>Seja bem vindo!</h3>
      <h6>Coloque suas informacoes para entrar</h6>

      <label htmlFor="nome">Nome</label>
      <input
        type="text"
        name="nome"
        id="nome"
        value={form.nome}
        onChange={handleChange}
      />

      <label htmlFor="email">Email</label>
      <input
        type="text"
        placeholder="Digite @user ou @admin"
        name="email"
        id="email"
        value={form.email}
        onChange={handleChange}
      />

      <label htmlFor="senha">Senha</label>
      <input
        type="password"
        name="senha"
        id="senha"
        value={form.senha}
        onChange={handleChange}
      />

      {erro && <p className="auth-error">{erro}</p>}

      <div className="auth-actions">
        <button type="submit">Entrar</button>
        <button type="button" className="auth-secondary" onClick={() => navigate("/cadastro")}>
          Cadastre-se
        </button>
      </div>
    </form>
  );
}

export default EntradaForm;
