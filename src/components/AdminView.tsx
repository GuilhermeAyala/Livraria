import React, {useState} from "react";
import { AdicionarLivros, Books } from "../data/books";
//import { Admin } from "../data/adm"; 

type Produto = {
    produto: string,
    price: number,
    autor: string;
    ano: number;
    quantidade: number;
}

function AdminInterface(){
   
    let [count, setCount] = useState(0);
    let [produto, setProduto] = useState<string>('');
    let [price, setPrice] = useState<string>('');
    let [autor, setAutor] = useState<string>('');
    let [ano, setAno] = useState<string>('');
    let [quantidade, setQuantidade] = useState<number>(0);
    let [jsonDados, setJsonDados] = useState<Produto | null>(null);

    const handleSubmit = (e:any) => {
        e.preventDefault();

        const novoProduto: Produto = {
            produto,
            price: Number(price),
            autor,
            ano: Number(ano),
            quantidade
        };
    setJsonDados(novoProduto);

    };

    const IncrementQtd = () => {
        setCount(count + 1);
        setQuantidade(quantidade + 1);
    }
    const DecrementQtd = () => {
        setCount(count - 1);
        setQuantidade(quantidade - 1);
        if(count && quantidade < 0){
          setCount(0);
        }
    }
   
    const AddLivroAoSistema = async() => {
        if(jsonDados){
            try{
                await AdicionarLivros(jsonDados);
                console.log("Livro enviado com sucesso");
            }
            catch(erro){
                console.error("Erro ao enviar livro", erro);
            }
        }
    };

    return(//pd virar json pro BD, além da parte react 
        <div>
            <h3>Gerenciar Livros</h3>
            <h3>Gerenciamento de Estoque</h3>
            <div style={{ backgroundColor: "#1a1a1a", width: 500, height: 400, padding: 12, borderRadius: 12 }}>
        <form onSubmit={handleSubmit}>
          <label>Titulo</label>
          <br />
          <input
            type="text"
            value={produto}
            placeholder="Nome Produto"
            onChange={(e) => setProduto(e.target.value)}
            style={{ height: 30, borderRadius: 15, width: "100%", marginBottom: 8, padding: 8, boxSizing: "border-box" }}
          />

          <label>Autor</label>
          <br />
          <input
            type="text"
            value={autor}
            placeholder="Autor"
            onChange={(e) => setAutor(String(e.target.value))}
            style={{ height: 30, borderRadius: 15, width: "100%", marginBottom: 8, padding: 8, boxSizing: "border-box" }}
          />

          <label>Ano de Publicação</label>
          <br />
          <input
            type="number"
            value={ano}
            placeholder="Ano publicação"
            onChange={(e) => setAno(String(e.target.value))}
            style={{ height: 30, borderRadius: 15, width: "100%", marginRight: "4%", marginBottom: 8, padding: 8, boxSizing: "border-box" }}
          />
          <br />

          <label>Preço</label>
          <br />
          <input
            type="number"
            value={price}
            placeholder="Preço"
            onChange={(e) => setPrice(String(e.target.value))}
            style={{ height: 30, borderRadius: 15, width: "100%", marginBottom: 8, padding: 8, boxSizing: "border-box" }}
          />
          <br />

          <label>Quantidade</label>
          <br />
          <div style={{ marginBottom: 8 }}>
            <button onClick={IncrementQtd} style={{ marginRight: 8 }}>+</button>
            <span style={{ margin: "0 8px" }}>{count}</span>
            <button onClick={DecrementQtd} style={{ marginLeft: 8 }}>-</button>
          </div>

          <br />

          <button
            onClick={AddLivroAoSistema}
            style={{ width: 180, height: 45, borderRadius: 15, backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}
          >
            Adicionar Livro ao sistema
          </button>

        </form>
      </div>

            <h3>Histórico de Compras</h3>

        </div>
    );
}

export default AdminInterface;