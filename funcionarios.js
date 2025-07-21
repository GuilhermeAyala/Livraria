class Funcionarios {
    constructor(id, name, salario, cargo, idade){
        this.id = id;
        this.name = name;
        this.salario = salario;
        this.cargo = cargo;
        this.idade = idade;
    }

}

class Vendedores extends Funcionarios {
    super(id, name, salario, cargo, idade, totalVendas, bonus){
        this.totalVendas = this.totalVendas
        this.bonus = this.bonus
    }
}

  

let Funcionario1 = new Funcionarios(0, "João", 2000, "Vendedor", 25, 1000)
let ListaFuncionarios = [Funcionario1]

function AddFuncionario(){//função funciona
    ListaFuncionarios.push(new Funcionarios(1, "Maria", 2500, "Supervisora", 26, 1500));
    console.log("Cadastro do Funcionário feito com sucesso");
}

function calcularBonus(name, totalVendas, bonus){
    if(totalVendas < 1000){
        bonus = totalVendas * 0.10;
        console.log(`${Funcionario1.name} fez ${totalVendas} e recebeu um bonus de ${bonus}`);
        return bonus;
    }

    else if(1000 <= totalVendas && totalVendas <= 2000){
        bonus = totalVendas * 0.15;
        console.log(`${Funcionario1.name} fez ${totalVendas} e recebeu um bonus de ${bonus}`);
        return bonus;
    }
    else if(2000 < totalVendas && totalVendas <= 3000){
        bonus = totalVendas * 0.20;
        console.log(`${Funcionario1.name} fez ${totalVendas} e recebeu um bonus de ${bonus}`);
        return bonus;
    }
    else{
        bonus = totalVendas * 0.25;
        console.log(`${Funcionario1.name} fez ${totalVendas} e recebeu um bonus de ${bonus}`);
        return bonus;
    }

}

calcularBonus(Funcionario1);

