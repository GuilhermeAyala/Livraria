import { AdicionarLivros } from "./books";

export class Admin {
    id;
    name;
    email;
    password;
    constructor(id: number, name: string, email: string, password: number){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

class Funcionarios {
    name;
    salario; 
    cargo;
    idade;
    totalDeVendas;
    constructor(name: string, salario: number, cargo: string, idade: number, totalDeVendas: number){
        this.name = name;
        this.salario = salario;
        this.cargo = cargo;
        this.idade = idade;
        this.totalDeVendas = totalDeVendas;
    }
}

const Admin1 = new Admin(0, "Peter", "peter@gmail.com", 12345)

let Funcionario1 = new Funcionarios("Lucas", 1200, "Vendedor", 25, 1500)

export async function adicionarFuncionario(funcionario: Funcionarios): Promise<void>{
    try {
        const resposta = await fetch('http://localhost:3000/api/funcionarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(funcionario),
        });

        if(!resposta.ok){
            throw new Error("Erro ao adicionar funcionário");
        }
        console.log('Funcionario adicionado com sucesso');
    } catch (error) {
        console.log('Erro:', error)
    }
}

const GerenciarEstoque = () => {}
