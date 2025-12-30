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

class Livro {
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

export async function AdicionarLivros(livro: Livro): Promise<void> {
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

