import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function ExisteLivro(books: object){
    if(!books){
    throw new Error("O livro não existe, banco vazio")
    //return false;
    }

    return books;
}

function validarLivro(){
    if(books.quantidade < 0){
        books.isAvailable = false
        throw new Error("Livro indisponível, quantidade insuficiente")
    }
}

//if(books.nome ==)