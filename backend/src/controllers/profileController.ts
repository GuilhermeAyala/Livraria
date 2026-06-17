import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth";
import { addPaymentCard, getProfile, updateProfile } from "../services/userService";

export async function show(req: AuthenticatedRequest, res: Response) {
  res.json(await getProfile(req.userId));
}

export async function update(req: AuthenticatedRequest, res: Response) {
  const { name, address } = req.body;
  res.json(await updateProfile(req.userId, { name, address }));
}

export async function storeCard(req: AuthenticatedRequest, res: Response) {
  const { type, holderName, brand, cardNumber, expiresAt } = req.body;

  if (!type || !holderName || !brand || !cardNumber || !expiresAt) {
    res.status(400).json({ error: "Dados do cartao incompletos." });
    return;
  }

  const card = await addPaymentCard(req.userId, { type, holderName, brand, cardNumber, expiresAt });
  res.status(201).json(card);
}
