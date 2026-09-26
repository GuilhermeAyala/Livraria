export class Book {
    id: number;
    name: string;
    autor: string;
    year: number;
    price: number;
    quantity: number;
    isAvailable: boolean;

    constructor(id: number, name: string, autor: string, year: number, price: number, quantity: number, isAvailable: boolean){
        this.id = id;
        this.name = name;
        this.autor = autor;
        this.year = year;
        this.price = price;
        this.quantity = quantity;
        this.isAvailable = isAvailable;
    }

    getTotal(): number{
        return this.price * this.quantity;
    }

}
