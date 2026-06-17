import type { Request, Response } from "express";
import { createBook, deleteBook, listBooks, updateBook } from "../services/bookService";

export async function index(_req: Request, res: Response) {
  res.json(await listBooks());
}

export async function store(req: Request, res: Response) {
  const { name, autor, year, price, quantity, quantidade, isAvailable } = req.body;

  if (!name || !autor || year === undefined || price === undefined) {
    res.status(400).json({ error: "Nome, autor, ano e preco sao obrigatorios." });
    return;
  }

  const book = await createBook({
    name,
    autor,
    year: Number(year),
    price: Number(price),
    quantity: Number(quantity ?? quantidade ?? 0),
    isAvailable,
  });

  res.status(201).json(book);
}

export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { quantity, quantidade, ...data } = req.body;

  const book = await updateBook(Number(id), {
    ...data,
    ...(quantity !== undefined || quantidade !== undefined ? { quantity: Number(quantity ?? quantidade) } : {}),
  });

  res.json(book);
}

export async function destroy(req: Request, res: Response) {
  const { id } = req.params;
  await deleteBook(Number(id));
  res.status(204).send();
}
