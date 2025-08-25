import React, {useState} from "react";
//import { Admin } from "../data/adm"; 

function AdminInterface(){
   
    let [count, setCount] = useState(0);
    let [produto, setProduto] = useState();
    let [price, setPrice] = useState();
    let [autor, setAutor] = useState();
    let [ano, setAno] = useState();

    const IncrementQtd = () => {
        setCount(count + 1)
    }
    const DecrementQtd = () => {
        setCount(count - 1)
    }
    if(count < 0){
        return count;
    }

    const AddLivroAoSistema = () => {}

    return(//pd virar json pro BD, além da parte react 
        <div>
            <h3>Gerenciar Livros</h3>
            <h3>Estoque</h3>
            <input type="text" value={produto} placeholder="Nome Produto"></input>
            <input type="text" value={autor} placeholder="Autor"></input>
            <input type="number" value={ano} placeholder="Ano publicação"></input>
            <input type="number" value={price} placeholder="Preço"></input><br />
            <button onClick={IncrementQtd}>+</button>Quantidade: {count}<button onClick={DecrementQtd}>-</button><br />
            <button onClick={AddLivroAoSistema} 
            style={{width: 150, height: 60, borderRadius: 15, backgroundColor: "red", color: "white"}}>Adicionar Livro ao sistema</button>

            <h3>Histórico de Compras</h3>
        </div>
    );
}

export default AdminInterface;