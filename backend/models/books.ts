export class Book {
    id: number;
    name: string;
    autor: string;
    year: number;
    price: number;
    quantidade: number;
    isAvailable: boolean;

    constructor(id: number, name: string, autor: string, year: number, price: number, quantidade: number, isAvailable: boolean){
        this.id = id;
        this.name = name;
        this.autor = autor;
        this.year = year;
        this.price = price;
        this.quantidade = quantidade;
        this.isAvailable = isAvailable;
    }

    getTotal(): number{
        return this.price * this.quantidade;
    }

}