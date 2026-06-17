import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../services/cartService";

export async function index(req: AuthenticatedRequest, res: Response) {
  res.json(await getCart(req.userId));
}

export async function store(req: AuthenticatedRequest, res: Response) {
  const { bookId, quantity } = req.body;

  if (!bookId) {
    res.status(400).json({ error: "bookId e obrigatorio." });
    return;
  }

  const item = await addCartItem(req.userId, Number(bookId), Number(quantity ?? 1));
  res.status(201).json(item);
}

export async function update(req: AuthenticatedRequest, res: Response) {
  const item = await updateCartItem(req.userId, Number(req.params.bookId), Number(req.body.quantity ?? 0));
  res.json(item);
}

export async function destroy(req: AuthenticatedRequest, res: Response) {
  await removeCartItem(req.userId, Number(req.params.bookId));
  res.status(204).send();
}
