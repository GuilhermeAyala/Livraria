class User {
    constructor(id, name, email, password, CPF, CEP){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.CPF = CPF;
        this.CEP = CEP;
    }

}
//passar dps condicionais para os campos da classe

let Usuario1 = new User(0, "Pedro", "pedro@gmail.com", 242424, 54321, 0);

let Users = [Usuario1];

function AddUser(...novosUsers){//a função adiciona, mas a verificação não está funcionando, corrigir depois
    novosUsers.forEach((user) => {
        if(!user || typeof user !== 'object'){
            console.log(`Objeto inválido`);
        }
        if(user.id === null || typeof user.id !== 'number'){
            console.log(`Id inexistente ou inválido`);
        }     
        if(typeof user.name !== "string"){
            console.log(`Nome precisa ser uma string`)
        }   
        if(user.password === null && user.password > 10){
            console.log("Senha inválida/deve ter no máximo 10 caracteres")
        }
        if(user.CPF !== 5 && typeof user.CPF !== "number"){
            console.log("CPF deve ter só numeros, não pode ser vazio")
        }
        else{
            Users.push(Users);
        }
        return Users;
    })
}

AddUser(
    new User(1, "Antonio", "antonio@gmail.com", 12345, 11111, 1),
    new User(2, "Maria", "maria@gmail.com", 23290 , 22222, 2),
)

AddUser();
console.log(Users);
export {User, Users};
