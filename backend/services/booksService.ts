import { PrismaClient } from "@prisma/client";
import { error } from "console";
import { BooksRepository } from "../repositories/booksRepository";

const prisma = new PrismaClient();

export class BooksService {
  constructor(private booksRepository: BooksRepository){}

  listarLivros() {
    return await prisma.Books.findMany();
  }

  getLivroById(id: number){
    const livro = this.Book.findbyId(id);
      if(!book){
        throw new Error("Livro não encontrado")
      }

    return book;
  }

  criarLivro(nome: string, valor: number, autor: string, ano: number, quantidade: number, isAvailable: boolean){
    if(!nome || !valor || !autor || !ano || !quantidade){
      throw new Error("Livro não pode ser criado, os atributos não devem ficar em branco")
    }
    if(valor < 0){
      throw new Error("O valor deve ser maior que zero")
    }
    if(isAvailable = false){
      throw new Error("O livro não aparece na lista")
    }

    return this.book.create({nome, valor, autor, ano, quantidade, isAvailable})
  }

  atualizarLivro(id: number, data:{nome?: string, valor?: number, quantidade?: number, isAvailable?: boolean}){
      if(!book){
        throw new Error("Sem livros para atualizar")
      }
      if(id < 0){
        throw new Error("id deve ser positivo")
      }
      if()
}

  deletarLivro(id: number){
    const deleted = this.book.delete(id)

    if(!deleted){
      throw new Error("Livro não encontrado")
    }
  }
}
