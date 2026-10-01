import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type EntradaFormData = {
  email: string;
  senha: string;
};

function EntradaForm({ onSubmit }: { onSubmit?: (form: EntradaFormData) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState<EntradaFormData>({
    email: "",
    senha: "",
  });
  const [erro, setErro] = useState(location.state?.message ?? "");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((formAtual) => ({ ...formAtual, [name]: value }));
  }

  function validarForm(dados: EntradaFormData) {
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

    try {
      const usuario = await login(form.email, form.senha);
      navigate(usuario.role === "ADMIN" ? "/admin" : "/user");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Nao foi possivel entrar.");
      return;
    }

    setErro("");
    onSubmit?.(form);
    setForm({ email: "", senha: "" });
  }

  return (
    <form className="box-form auth-form" onSubmit={handleSubmit}>
      <h3>Seja bem vindo!</h3>
      <h6>Coloque suas informacoes para entrar</h6>

      <label htmlFor="email">Email</label>
      <input
        type="text"
        placeholder="seu@email.com"
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
