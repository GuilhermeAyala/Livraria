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

const Admin1 = new Admin(0, "Peter", "peter@gmail.com", 12345)

const AdicionarFuncionarios = () => {}

const GerenciarEstoque = () => {}
