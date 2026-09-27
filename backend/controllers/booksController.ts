import type { Request, Response } from "express";
import { BooksService } from "../services/booksService";

function getStatusCode(error: unknown) {
  if (!(error instanceof Error)) return 500;
  if (error.message.includes("nao autenticado")) return 401;
  if (error.message.includes("nao encontrado")) return 404;
  return 400;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro interno do servidor.";
}

export class BooksController {
  constructor(private booksService: BooksService) {}

  private getOptionalUserId(req: Request) {
    const rawUserId = req.header("x-user-id");
    if (!rawUserId) return undefined;

    const userId = Number(rawUserId);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Id do usuario invalido.");
    }

    return userId;
  }

  private getRequiredUserId(req: Request) {
    const userId = this.getOptionalUserId(req);
    if (!userId) {
      throw new Error("Usuario nao autenticado.");
    }

    return userId;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const books = await this.booksService.listarLivros(this.getOptionalUserId(req));
      return res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({ message: getErrorMessage(error) });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const book = await this.booksService.getLivroById(id, this.getOptionalUserId(req));
      return res.status(200).json(book);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  rate = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const userId = this.getRequiredUserId(req);
      const book = await this.booksService.avaliarLivro(id, userId, req.body);
      return res.status(200).json(book);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const book = await this.booksService.criarLivro(req.body);
      return res.status(201).json(book);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const updatedBook = await this.booksService.atualizarLivro(id, req.body);
      return res.status(200).json(updatedBook);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.booksService.deletarLivro(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };
}
