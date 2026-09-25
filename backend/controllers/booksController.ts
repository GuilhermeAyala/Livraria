import type { Request, Response } from "express";
import { BooksService } from "../services/booksService";

function getStatusCode(error: unknown) {
  if (!(error instanceof Error)) return 500;
  if (error.message.includes("nao encontrado")) return 404;
  return 400;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro interno do servidor.";
}

export class BooksController {
  constructor(private booksService: BooksService) {}

  getAll = (_req: Request, res: Response) => {
    try {
      const books = this.booksService.listarLivros();
      return res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({ message: getErrorMessage(error) });
    }
  };

  getById = (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const book = this.booksService.getLivroById(id);
      return res.status(200).json(book);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  create = (req: Request, res: Response) => {
    try {
      const book = this.booksService.criarLivro(req.body);
      return res.status(201).json(book);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  update = (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const updatedBook = this.booksService.atualizarLivro(id, req.body);
      return res.status(200).json(updatedBook);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  delete = (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      this.booksService.deletarLivro(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };
}
