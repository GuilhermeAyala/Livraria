//import {} from "../services"
//importar do service quando ele se comunicar com o livro pra pegar do banco 
import { PrismaClient } from "@prisma/client"
import type {Request, Response } from "express"
import { BooksService } from "../services/booksService"

export class BooksController{
    constructor(private booksService: BooksService){}

    getAll = (req: Request, res: Response) => {
        const books = this.booksService.listarLivros();
        return res.json(books)
    }

    getById = (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const book = this.booksService.getLivroById(id)
        } catch(error: any) {
            return res.status(404).json({message: error.message})
        }
    }

    create = (req: Request, res: Response) => {
        try {
            const {nome, valor, autor, ano, quantidade, isAvailable} = req.body;
            const book = this.booksService.criarLivro(nome, valor, autor, ano, quantidade, isAvailable);
            return res.status(201).json(book);
        } 
        catch(error: any) {
            return res.status(400).json({message: error.message})
        }
    }
    
    update = (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const updatedBook = this.booksService.atualizarLivro(id, req.body);
            return res.json(updatedBook);
        } catch (error: any){
            return res.status(400).json({message: error.message})
        }
    }

    delete = (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            this.booksService.deletarLivro(id);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(404).json({message: error.message})
        }
    }
}