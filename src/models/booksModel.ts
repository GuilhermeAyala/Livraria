export class Book {
    id: number;
    name: string;
    autor: string;
    year: number;
    price: number;
    quantity: number;
    isAvailable: boolean;
    averageRating: number | null;
    ratingCount: number;
    myRating: number | null;

    constructor(
        id: number,
        name: string,
        autor: string,
        year: number,
        price: number,
        quantity: number,
        isAvailable: boolean,
        averageRating: number | null = null,
        ratingCount = 0,
        myRating: number | null = null
    ){
        this.id = id;
        this.name = name;
        this.autor = autor;
        this.year = year;
        this.price = price;
        this.quantity = quantity;
        this.isAvailable = isAvailable;
        this.averageRating = averageRating;
        this.ratingCount = ratingCount;
        this.myRating = myRating;
    }

    getTotal(): number{
        return this.price * this.quantity;
    }

}
