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

class Books {
    name: string;
    price: number;
    autor: string;
    ano: number;
    quantidade: number;
    constructor(name:string, price:number, autor:string, ano:number, quantidade:number){
        this.name = name;
        this.price = price;
        this.autor = autor;
        this.ano = ano;
        this.quantidade = quantidade;
    }
}
//classe de usuarios para conectar com async -> prisma/BD mais requisição futura

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

export async function AdicionarLivros(livro: Books): Promise<void> {
  try {
    const resposta = await fetch('http://localhost:3000/api/livros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro),
    });

    if (!resposta.ok) throw new Error('Erro ao adicionar livro');
    console.log('Livro adicionado com sucesso');
  } catch (error) {
    console.error('Erro:', error);
  }
}

