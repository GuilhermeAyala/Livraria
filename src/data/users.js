class User {
    constructor(id, name, email){
        this.id = id;
        this.name = name;
        this.email = email;
    }

}

Usuario1 = new User(0, "Pedro", "pedro@gmail.com");

let Users = [Usuario1];

function AddUser(){//funcionando
     Users.push(new User(1, "Antonio", "antonio@gmail.com"));
     Users.push(new User(2, "Maria", "maria@gmail.com"));

     console.log("Usuario adicionado");
}
