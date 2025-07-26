class Funcionarios {
    constructor(id, name, salario, cargo, idade, totalVendas){
        this.id = id;
        this.name = name;
        this.salario = salario;
        this.cargo = cargo;
        this.idade = idade;
        this.totalVendas = totalVendas
    }

}

let Funcionario1 = new Funcionarios(0, "João", 2000, "Analista", 25, 1000)
let Funcionario2 = new Funcionarios(1, "Lucas", 4000, "Telemarketing", 28, 3500)
let ListaFuncionarios = [Funcionario1, Funcionario2]

function AddFuncionario(){//função funciona, mas lembre sempre de chama-la
    ListaFuncionarios.push(new Funcionarios(2, "Maria", 2500, "Supervisora", 26, 1500));
    console.log("Cadastro do Funcionário feito com sucesso");
}

function calcularBonus(funcionario) {
    const vendas = funcionario.totalVendas;
    let bonus;

    if (vendas < 1000) {
        bonus = vendas * 0.10;
    } 
    else if (vendas <= 2000) {
        bonus = vendas * 0.15;
    } 
    else if (vendas <= 3000) {
        bonus = vendas * 0.20;
    } 
    else {
        bonus = vendas * 0.25;
    }

    console.log(`${funcionario.name} vendeu um total de R$${vendas} e recebeu um bônus de R$${bonus.toFixed(2)}`);
    return bonus;
}

AddFuncionario();
//console.log(ListaFuncionarios);
calcularBonus(ListaFuncionarios[2]);