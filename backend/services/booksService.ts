import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function criarLivro(){
    if(!books){
        throw new Error("O livro não existe, banco vazio")
        return false;
    }

}

function validarLivro(){
    if(books.quantidade < 0){
        books.isAvailable = false
        throw new Error("Livro indisponível, quantidade insuficiente")
    }
    if()
}

//if(books.nome ==)