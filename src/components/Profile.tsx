import React, {useState} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { AdicionarCartão, AdicionarCartaoDebito } from '../models/pagamento';
import { useCartoes } from '../contexts/CartoesContext';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const nome = location.state?.nome;
    const {adicionarCartao} = useCartoes();
    const [address, setAddress] = useState('');
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
        limite: ""
    });

     const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdicionarCartao = () => {
        setErro("");
        setSucesso("");
        try {
            const validade = new Date(form.validade);
            const id = Date.now(); // id único simples

            if(abaCartao === "Credito"){
                const cartao = AdicionarCartão(
                    id,
                    form.nomeTitular,
                    form.numeroCartao,
                    validade,
                    form.marca,
                    form.cvc,
                    Number(form.saldo),
                    Number(form.limite)
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
                    Number(form.saldo)
                );
                adicionarCartao({ tipo: "Debito", cartao });
            }

            setSucesso("Cartão adicionado com sucesso!");
            setForm({ nomeTitular: "", numeroCartao: "", validade: "", marca: "", cvc: "", saldo: "", limite: "" });

        } catch(e: any) {
            setErro(e.message);
        }
    };

    return(
        <div>
            <h2>Olá {nome}!</h2>
            <label htmlFor="">
                Endereço:{""}
                <input type="text" value={address} name="endereco" id="endereco" onChange={e => setAddress(e.target.value)}/>
            </label>
            
            <br /><br />

            <div>
                <button onClick={() => setAbaCartao("Credito")}>Adicionar Cartão de Crédito</button>
                {" "}
                <button onClick={() => setAbaCartao("Debito")}>Adicionar Cartão de Débito</button>
            </div>

            {abaCartao && (
                <div style={{ marginTop: 16, border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
                    <h3>Novo Cartão de {abaCartao === "Credito" ? "Crédito" : "Débito"}</h3>

                    <input name="nomeTitular"  placeholder="Nome do titular"   value={form.nomeTitular}  onChange={handleForm} /><br />
                    <input name="numeroCartao" placeholder="Número (16 dígitos)" value={form.numeroCartao} onChange={handleForm} /><br />
                    <input name="validade"     placeholder="Validade"  type="date" value={form.validade}     onChange={handleForm} /><br />
                    <input name="marca"        placeholder="Bandeira (Visa, Master...)" value={form.marca}   onChange={handleForm} /><br />
                    <input name="cvc"          placeholder="CVC (3 dígitos)"   value={form.cvc}          onChange={handleForm} /><br />
                    <input name="saldo"        placeholder="Saldo disponível"  value={form.saldo}        onChange={handleForm} type="number" /><br />

                    {abaCartao === "Credito" && (
                        <input name="limite" placeholder="Limite do cartão" value={form.limite} onChange={handleForm} type="number" />
                    )}

                    <br /><br />
                    {erro && <p style={{ color: "red" }}>{erro}</p>}
                    {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

                    <button onClick={handleAdicionarCartao}>Salvar Cartão</button>
                    <button onClick={() => { setAbaCartao(null); setErro(""); setSucesso(""); }} style={{ marginLeft: 8 }}>Cancelar</button>
                </div>
            )}

            <br />
            <button onClick={() => navigate("/")}>LogOut</button>           
        </div>
    );

};

export default Profile;