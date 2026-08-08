export class User {
    id: number;
    nome: string;
    email: string;
    password: string;
    CPF: string;
    CEP: string;
    constructor(id: number, nome: string, email: string, password: string, CPF: string, CEP: string){
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.password = password;
        this.CPF = CPF;
        this.CEP = CEP;
    }

}