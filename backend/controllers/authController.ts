import type { Request, Response } from "express";
import { createSessionToken, getSessionCookie, hashPassword, hashSessionToken, SESSION_DURATION_MS, verifyPassword } from "../auth";
import { prisma } from "../prismaClient";
import type { AuthenticatedRequest } from "../middleware/session";

function publicUser(user: { id: number; name: string; email: string; role: string; address: string | null }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address };
}

export async function loginController(req: Request, res: Response) {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: "Email ou senha invalidos." });
  }

  const rawToken = createSessionToken();
  await prisma.session.create({
    data: { id: hashSessionToken(rawToken), userId: user.id, expiresAt: new Date(Date.now() + SESSION_DURATION_MS) },
  });

  res.setHeader("Set-Cookie", getSessionCookie(rawToken));
  return res.status(200).json({ user: publicUser(user) });
}

export async function meController(req: AuthenticatedRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, name: true, email: true, role: true, address: true } });
  if (!user) return res.status(401).json({ message: "Usuario nao encontrado." });
  return res.status(200).json({ user });
}

export async function logoutController(req: AuthenticatedRequest, res: Response) {
  const rawToken = req.headers.cookie ? req.headers.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith("livraria_session="))?.slice("livraria_session=".length) : undefined;
  if (rawToken) await prisma.session.deleteMany({ where: { id: hashSessionToken(rawToken) } });
  res.setHeader("Set-Cookie", getSessionCookie("", 0));
  return res.status(204).send();
}

export function passwordData(password: string) {
  return hashPassword(password);
}
