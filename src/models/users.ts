class User {
    id: number;
    name: string;
    email: string;
    password: string;
    CPF: string;
    CEP: string;
    constructor(id: number, name: string, email: string, password: string, CPF: string, CEP: string){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.CPF = CPF;
        this.CEP = CEP;
    }

}

let Usuario1 = new User(0, "Pedro", "pedro@gmail.com", "242424", "54321", "0");

let Users = [Usuario1];

const createUser = () => {};

function validarUser(user: User): string | null {
  if (!user || typeof user !== "object") return "Objeto inválido";
  if (user.id === null || typeof user.id !== "number") return "Id inexistente ou inválido";
  if (typeof user.name !== "string" || !user.name.trim()) return "Nome precisa ser uma string válida";
  if (!user.password || user.password.length > 10) return "Senha inválida — máximo 10 caracteres";
  if (!user.CPF || !/^\d+$/.test(user.CPF)) return "CPF deve conter apenas números";
  return null;
}

export function AddUser(users: User[], ...novosUsers: User[]): User[] {
    novosUsers.forEach((user) => {
        const erro = validarUser(user);
        if(erro){
            console.error(`Erro ao adicionar usuário ${user.name}: ${erro}`);
            return;
        }
        users.push(user);
    });
            return Users;
}

export {User, Users};
