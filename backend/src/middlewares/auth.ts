import type { NextFunction, Request, Response } from "express";

export type AuthenticatedRequest = Request & {
  userId: number;
  userRole: "USER" | "ADMIN";
};

/*
BACKEND LIVRARIA - IDEIA GERAL

Esta etapa ainda usa headers para facilitar o estudo:
- x-user-id: id do usuario atual
- x-user-role: USER ou ADMIN, com fallback para USER

Quando JWT entrar, este middleware deve validar o token e preencher
req.userId e req.userRole a partir do usuario autenticado.
*/
export function simulateAuth(req: Request, res: Response, next: NextFunction) {
  const headerUserId = Number(req.header("x-user-id"));
  const headerRole = req.header("x-user-role");

  if (!Number.isInteger(headerUserId) || headerUserId <= 0) {
    res.status(401).json({ error: "Usuario nao autenticado." });
    return;
  }

  const request = req as AuthenticatedRequest;
  request.userId = headerUserId;
  request.userRole = headerRole === "ADMIN" ? "ADMIN" : "USER";

  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const request = req as AuthenticatedRequest;

  if (request.userRole !== "ADMIN") {
    res.status(403).json({ error: "Apenas administradores podem acessar esta rota." });
    return;
  }

  next();
}
