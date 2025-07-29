class User {
    constructor(id, name, email, CPF){
        this.id = id;
        this.name = name;
        this.email = email;
        this.CPF = CPF;
        this.CEP = this.CEP;
    }

}
//passar dps condicionais para os campos da classe

Usuario1 = new User(0, "Pedro", "pedro@gmail.com", 0, 0);

let Users = [Usuario1];

function AddUser(){//funcionando
     Users.push(new User(1, "Antonio", "antonio@gmail.com", 1, 1));
     Users.push(new User(2, "Maria", "maria@gmail.com", 2, 2));
     if(User.id === null && User.id !== typeof(Number)){
        console.log("O id tem que ser inteiro")
     }
     
     console.log("Usuario adicionado");
}

module.exports = {User, Users}
