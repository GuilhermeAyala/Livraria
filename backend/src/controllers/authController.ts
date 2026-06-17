import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/userService";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Nome, email e senha sao obrigatorios." });
    return;
  }

  const result = await registerUser({ name, email, password });
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email e senha sao obrigatorios." });
    return;
  }

  const result = await loginUser(email, password);
  res.json(result);
}
