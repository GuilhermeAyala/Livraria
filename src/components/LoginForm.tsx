import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarUsuario, loginUsuario, setCurrentUser } from "../api/booksApi";

function LoginForm({ onSubmit }: any): any {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [erro, setErro] = useState("");

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validarForm(formAtual: any) {
    if (!formAtual.nome.trim()) return "Nome obrigatorio";
    if (!formAtual.email.includes("@")) return "Email invalido";
    if (formAtual.senha.length < 4) return "Senha deve ter pelo menos 4 caracteres";
    return "";
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const message = validarForm(form);
    if (message) {
      setErro(message);
      return;
    }

    try {
      let result;

      try {
        result = await cadastrarUsuario({
          name: form.nome,
          email: form.email,
          password: form.senha,
        });
      } catch {
        result = await loginUsuario({
          email: form.email,
          password: form.senha,
        });
      }

      setCurrentUser(result.user);
      setErro("");
      onSubmit?.(form);
      setForm({ nome: "", email: "", senha: "" });
      navigate("/user", { state: { nome: result.user.name } });
    } catch (error: any) {
      setErro(error.message || "Nao foi possivel entrar.");
    }
  }

  return (
    <form
      className="box-form"
      onSubmit={handleSubmit}
      style={{
        color: "white",
        backgroundColor: "rgb(0, 0, 128)",
        height: 330,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 20,
      }}
    >
      <h3>Seja bem vindo!</h3>
      <h6>Coloque suas informacoes para cadastrar ou entrar</h6>

      <label htmlFor="nome">Nome</label>
      <input
        style={{ padding: 10, border: "solid", borderRadius: 10 }}
        type="text"
        name="nome"
        id="nome"
        value={form.nome}
        onChange={handleChange}
      />
      <br />

      <label htmlFor="email">Email</label>
      <input
        style={{ padding: 10, border: "solid", borderRadius: 10 }}
        type="text"
        placeholder="seu@email.com"
        name="email"
        id="email"
        value={form.email}
        onChange={handleChange}
      />
      <br />

      <label htmlFor="senha">Senha</label>
      <input
        style={{ padding: 10, border: "solid", borderRadius: 10 }}
        type="password"
        name="senha"
        id="senha"
        value={form.senha}
        onChange={handleChange}
      />
      <br />
      <br />

      <button
        type="submit"
        style={{ backgroundColor: "ghostwhite", color: "black", padding: 10, width: 150, height: 34, borderRadius: 15 }}
      >
        Entrar
      </button>

      {erro && <p style={{ color: "salmon" }}>{erro}</p>}
    </form>
  );
}

export default LoginForm;
