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
    id;
    name;
    salario; 
    cargo;
    idade;
    totalDeVendas;
    constructor(id: number, name: string, salario: number, cargo: string, idade: number, totalDeVendas: number){
        this.id = id;
        this.name = name;
        this.salario = salario;
        this.cargo = cargo;
        this.idade = idade;
        this.totalDeVendas = totalDeVendas;
    }
}

const Admin1 = new Admin(0, "Peter", "peter@gmail.com", 12345)

let Funcionario1 = new Funcionarios(0, "Lucas", 1200, "Vendedor", 25, 1500)
let ArrayFuncionarios = [Funcionario1];

const AdicionarFuncionarios = (...novosFuncionarios) => {
    novosFuncionarios.forEach(funcionario => {
        ArrayFuncionarios.push();
        return ArrayFuncionarios;
    });
}

console.log("Hello");

const GerenciarEstoque = () => {}
