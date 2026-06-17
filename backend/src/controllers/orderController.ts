import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth";
import { createOrder } from "../services/orderService";
import type { PaymentMethod } from "../services/orderService";

const validMethods = ["CREDITO", "DEBITO", "PIX", "BOLETO"];

export async function store(req: AuthenticatedRequest, res: Response) {
  const paymentMethod = String(req.body.paymentMethod || "").toUpperCase();

  if (!validMethods.includes(paymentMethod)) {
    res.status(400).json({ error: "Metodo de pagamento invalido." });
    return;
  }

  const order = await createOrder(req.userId, paymentMethod as PaymentMethod);
  res.status(201).json(order);
}
