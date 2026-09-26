export class User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    address?: string;

    constructor(id: number, name: string, email: string, passwordHash: string, address?: string){
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.address = address;
    }
}
