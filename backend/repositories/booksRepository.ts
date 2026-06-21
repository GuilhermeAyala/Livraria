import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listarLivros(){
    return await prisma.books.findMany()
}

export async function criarLivro(nome: string, valor: number, autor: string, ano: number, quantidade: number, isAvailable: boolean){
    return await prisma.books.create({
        data: {
            nome, valor, autor, ano, quantidade, isAvailable
        }
    })
}

export async function editarLivro(id: number, dados: object){
    return await prisma.books.update({
        where: {id}, data: dados
    })
}

export async function excluirLivro(id: number){
        return await prisma.books.delete({
            where: {id}
        })
    }