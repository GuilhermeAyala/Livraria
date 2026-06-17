import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth";
import { addFavorite, getFavorites, removeFavorite } from "../services/favoriteService";

export async function index(req: AuthenticatedRequest, res: Response) {
  res.json(await getFavorites(req.userId));
}

export async function store(req: AuthenticatedRequest, res: Response) {
  const favorite = await addFavorite(req.userId, Number(req.params.bookId));
  res.status(201).json(favorite);
}

export async function destroy(req: AuthenticatedRequest, res: Response) {
  await removeFavorite(req.userId, Number(req.params.bookId));
  res.status(204).send();
}
