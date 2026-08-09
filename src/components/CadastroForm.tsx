import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type CadastroFormData = {
  nome: string;
  email: string;
  senha: string;
  CPF: string;
  CEP: string;
};

const formInicial: CadastroFormData = {
  nome: "",
  email: "",
  senha: "",
  CPF: "",
  CEP: "",
};

const caracterEspecial = ["@", "!", "&", "*", "?", "#", "+", "-"];
const emailsValidos = ["outlook", "gmail", "yahoo", "hotmail"];

function CadastroForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CadastroFormData>(formInicial);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((formAtual) => ({ ...formAtual, [name]: value }));
  }

  function validarForm(dados: CadastroFormData) {
    const temCaracterEspecial = caracterEspecial.some((caracter) =>
      dados.senha.includes(caracter)
    );
    const temEmailValido = emailsValidos.some((email) =>
      dados.email.includes(email)
    );

    if (!dados.nome.trim() || !dados.email.trim() || !dados.senha.trim() || !dados.CPF.trim() || !dados.CEP.trim()) {
      return "Preencha nome, email, senha, CPF e CEP.";
    }
    if (dados.CPF.length !== 11) {
      return "CPF deve conter 11 caracteres.";
    }
    if (!dados.email.includes("@") || !temEmailValido) {
      return "Email deve ter @ e um endereco valido.";
    }
    if (dados.senha.length < 10 || !temCaracterEspecial) {
      return "A senha deve ter pelo menos 10 caracteres e um caractere especial.";
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

    setSalvando(true);
    setErro("");

    try {
      const response = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          password: form.senha,
          CPF: form.CPF,
          CEP: form.CEP,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Nao foi possivel cadastrar o usuario.");
      }

      setForm(formInicial);
      navigate("/");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao cadastrar usuario.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form className="box-form auth-form" onSubmit={handleSubmit}>
      <h3>Cadastro</h3>
      <h6>Crie seu acesso com os dados do usuario</h6>

      <label htmlFor="cadastro-nome">Nome</label>
      <input
        type="text"
        name="nome"
        id="cadastro-nome"
        value={form.nome}
        onChange={handleChange}
      />

      <label htmlFor="cadastro-email">Email</label>
      <input
        type="email"
        name="email"
        id="cadastro-email"
        value={form.email}
        onChange={handleChange}
      />

      <label htmlFor="cadastro-senha">Senha</label>
      <input
        type="password"
        name="senha"
        id="cadastro-senha"
        value={form.senha}
        onChange={handleChange}
      />

      <label htmlFor="cadastro-cpf">CPF</label>
      <input
        type="text"
        name="CPF"
        id="cadastro-cpf"
        maxLength={11}
        value={form.CPF}
        onChange={handleChange}
      />

      <label htmlFor="cadastro-cep">CEP</label>
      <input
        type="text"
        name="CEP"
        id="cadastro-cep"
        value={form.CEP}
        onChange={handleChange}
      />

      {erro && <p className="auth-error">{erro}</p>}

      <div className="auth-actions">
        <button type="submit" disabled={salvando}>
          {salvando ? "Cadastrando..." : "Cadastrar"}
        </button>
        <button type="button" className="auth-secondary" onClick={() => navigate("/")}>
          Entrar
        </button>
      </div>
    </form>
  );
}

export default CadastroForm;
