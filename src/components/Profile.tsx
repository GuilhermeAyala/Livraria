import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdicionarCartao, AdicionarCartaoDebito } from "../models/pagamento";
import { useCartoes } from "../contexts/CartoesContext";
import { adicionarCartaoAoPerfil, clearCurrentUser, getCurrentUser, getProfile, updateProfile } from "../api/booksApi";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nome = location.state?.nome || getCurrentUser()?.name || "Usuario";
  const { adicionarCartao } = useCartoes();
  const [address, setAddress] = useState("");
  const [abaCartao, setAbaCartao] = useState<"Credito" | "Debito" | null>(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [form, setForm] = useState({
    nomeTitular: "",
    numeroCartao: "",
    validade: "",
    marca: "",
    cvc: "",
    saldo: "",
    limite: "",
  });

  useEffect(() => {
    getProfile()
      .then((profile) => setAddress(profile?.address || ""))
      .catch(() => {});
  }, []);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvarPerfil = async () => {
    setErro("");
    setSucesso("");

    try {
      await updateProfile({ name: nome, address });
      setSucesso("Perfil salvo com sucesso!");
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleAdicionarCartao = async () => {
    setErro("");
    setSucesso("");

    try {
      const validade = new Date(form.validade);
      const id = Date.now();

      if (abaCartao === "Credito") {
        const cartao = AdicionarCartao(
          id,
          form.nomeTitular,
          form.numeroCartao,
          validade,
          form.marca,
          form.cvc,
          Number(form.saldo),
          Number(form.limite),
        );
        adicionarCartao({ tipo: "Credito", cartao });
      } else {
        const cartao = AdicionarCartaoDebito(
          id,
          form.nomeTitular,
          form.numeroCartao,
          validade,
          form.marca,
          form.cvc,
          Number(form.saldo),
        );
        adicionarCartao({ tipo: "Debito", cartao });
      }

      await adicionarCartaoAoPerfil({
        type: abaCartao || "Debito",
        holderName: form.nomeTitular,
        brand: form.marca,
        cardNumber: form.numeroCartao,
        expiresAt: form.validade,
      });

      setSucesso("Cartao adicionado com sucesso!");
      setForm({ nomeTitular: "", numeroCartao: "", validade: "", marca: "", cvc: "", saldo: "", limite: "" });
    } catch (e: any) {
      setErro(e.message);
    }
  };

  return (
    <div>
      <h2>Ola {nome}!</h2>
      <label htmlFor="endereco">
        Endereco:{" "}
        <input
          type="text"
          value={address}
          name="endereco"
          id="endereco"
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
      <button onClick={handleSalvarPerfil} style={{ marginLeft: 8 }}>
        Salvar perfil
      </button>

      <br />
      <br />

      <div>
        <button onClick={() => setAbaCartao("Credito")}>Adicionar Cartao de Credito</button>{" "}
        <button onClick={() => setAbaCartao("Debito")}>Adicionar Cartao de Debito</button>
      </div>

      {abaCartao && (
        <div style={{ marginTop: 16, border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
          <h3>Novo Cartao de {abaCartao === "Credito" ? "Credito" : "Debito"}</h3>

          <input name="nomeTitular" placeholder="Nome do titular" value={form.nomeTitular} onChange={handleForm} />
          <br />
          <input
            name="numeroCartao"
            placeholder="Numero (16 digitos)"
            value={form.numeroCartao}
            onChange={handleForm}
          />
          <br />
          <input name="validade" placeholder="Validade" type="date" value={form.validade} onChange={handleForm} />
          <br />
          <input name="marca" placeholder="Bandeira (Visa, Master...)" value={form.marca} onChange={handleForm} />
          <br />
          <input name="cvc" placeholder="CVC (3 digitos)" value={form.cvc} onChange={handleForm} />
          <br />
          <input name="saldo" placeholder="Saldo disponivel" value={form.saldo} onChange={handleForm} type="number" />
          <br />

          {abaCartao === "Credito" && (
            <input name="limite" placeholder="Limite do cartao" value={form.limite} onChange={handleForm} type="number" />
          )}

          <br />
          <br />
          {erro && <p style={{ color: "red" }}>{erro}</p>}
          {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

          <button onClick={handleAdicionarCartao}>Salvar Cartao</button>
          <button onClick={() => { setAbaCartao(null); setErro(""); setSucesso(""); }} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        </div>
      )}

      <br />
      <button onClick={() => { clearCurrentUser(); navigate("/"); }}>LogOut</button>
    </div>
  );
};

export default Profile;
