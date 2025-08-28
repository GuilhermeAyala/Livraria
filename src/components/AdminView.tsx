import React, {useState} from "react";
import { Books } from "../data/books";
//import { Admin } from "../data/adm"; 

type Produto = {
    produto: string,
    price: number,
    autor: string;
    ano: number;
    quantidade: number;
}

type Funcionario = {
    name: string,
    salario: number,
    cargo: string,
    idade: number,
}

function AdminInterface(){
   
    let [count, setCount] = useState(0);
    let [produto, setProduto] = useState<string>('');
    let [price, setPrice] = useState<string>('');
    let [autor, setAutor] = useState<string>('');
    let [ano, setAno] = useState<string>('');
    let [quantidade, setQuantidade] = useState<number>(0);
    let [jsonDados, setJsonDados] = useState<Produto | null>(null);

    let [name, setName] = useState<string>('');
    let [salario, setSalario] = useState<number>();
    let [cargo, setCargo] = useState<string>('');
    let [idade, setIdade] = useState<number>();
    let [jsonInfo, setJsonInfo] = useState<Funcionario | null>(null);

    const handleSubmit = (e) => {
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

    const CadastroFuncionario = (e) => {
        e.preventDefault();

        const novoFuncionario: Funcionario = {
            name,
            salario: Number(salario),
            cargo, 
            idade: Number(idade),
        }
        setJsonInfo(novoFuncionario);
    }

    const IncrementQtd = () => {
        setCount(count + 1);
        setQuantidade(quantidade + 1);
    }
    const DecrementQtd = () => {
        setCount(count - 1);
        setQuantidade(quantidade - 1);
    }
    if(count && quantidade < 0){
        return count;
    }

    const AddLivroAoSistema = () => {//n faz nd por enqt, ver a logica depois
        const ObjectBook = JSON.stringify({book: [new Books()]})
    }

    const AddFuncionarioAoSistema = () => {
        const ObjectFuncionario = JSON.stringify;// por enqt vazio, ideia: criar um objeto de funcionario para BD
    }

    return(//pd virar json pro BD, além da parte react 
        <div>
            <h3>Gerenciar Livros</h3>
            <h3>Gerencimaneto de Estoque</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" value={produto} placeholder="Nome Produto" 
                onChange={(e) => setProduto(e.target.value)} style={{height: 30, borderRadius: 15}}></input>

                <input type="text" value={autor} placeholder="Autor" 
                onChange={(e) => setAutor(String(e.target.value))} style={{height: 30, borderRadius: 15}}></input>

                <input type="number" value={ano} placeholder="Ano publicação" 
                onChange={(e) => setAno(String(e.target.value))} style={{height: 30, borderRadius: 15}}></input>

                <input type="number" value={price} placeholder="Preço" 
                onChange={(e) => setPrice(String(e.target.value))} style={{height: 30, borderRadius: 15}}></input><br />

                <button onClick={IncrementQtd}>+</button>Quantidade: {count}<button onClick={DecrementQtd}>-</button><br />
                <button onClick={AddLivroAoSistema} 
                style={{width: 150, height: 60, borderRadius: 15, backgroundColor: "red", color: "white"}}>Adicionar Livro ao sistema</button>

                {jsonDados && (<pre>{JSON.stringify(jsonDados, null, 2)}</pre>)}
            </form>

            <h3>Histórico de Compras</h3>

            <h3>Gerenciamento de Funcionários</h3>
            <form onSubmit={CadastroFuncionario}>
                <input type="text" value={name} placeholder="Nome Funcionário" 
                onChange={(e) => setName(e.target.value)} style={{height: 30, borderRadius: 15}}></input>
                <input type="number" value={salario} placeholder="Salario Funcionário" 
                onChange={(e) => setSalario(Number(e.target.value))} style={{height: 30, borderRadius: 15}}></input>
                <input type="text" value={cargo} placeholder="Cargo Funcionário" 
                onChange={(e) => setCargo(String(e.target.value))} style={{height: 30, borderRadius: 15}}></input>
                <input type="number" value={idade} placeholder="Idade Funcionario" 
                onChange={(e) => setIdade(Number(e.target.value))} style={{height: 30, borderRadius: 15}}></input><br />
                <button onClick={AddFuncionarioAoSistema} 
                style={{width: 150, height: 60, borderRadius: 15, backgroundColor: "red", color: "white"}}>Adicionar Funcionário ao Sistema</button>
                {jsonInfo && (<pre>{JSON.stringify(jsonInfo, null, 2)}</pre>)}
            </form>
        </div>
    );
}

export default AdminInterface;