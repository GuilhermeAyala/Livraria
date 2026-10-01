import type { NextFunction, Request, Response } from "express";
import { hashSessionToken, getSessionToken } from "../auth";
import { prisma } from "../prismaClient";

export type AuthenticatedRequest = Request & { userId?: number; userRole?: string };

export async function requireSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const rawToken = getSessionToken(req);
    if (!rawToken) return res.status(401).json({ message: "Usuario nao autenticado." });

    const session = await prisma.session.findUnique({
      where: { id: hashSessionToken(rawToken) },
      include: { user: { select: { id: true, role: true } } },
    });

    if (!session || session.expiresAt <= new Date()) {
      return res.status(401).json({ message: "Sessao expirada. Entre novamente." });
    }

    req.userId = session.user.id;
    req.userRole = session.user.role;
    return next();
  } catch {
    return res.status(500).json({ message: "Nao foi possivel validar a sessao." });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ message: "Acesso restrito ao administrador." });
  }
  return next();
}
