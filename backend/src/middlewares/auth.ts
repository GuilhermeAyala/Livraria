import type { NextFunction, Request, Response } from "express";

export type AuthenticatedRequest = Request & {
  userId: number;
  userRole: "USER" | "ADMIN";
};

/*
BACKEND LIVRARIA - IDEIA GERAL

Esta etapa ainda usa um usuario simulado por header para facilitar o estudo:
- x-user-id: id do usuario atual, com fallback para 1
- x-user-role: USER ou ADMIN, com fallback para USER

Quando JWT entrar, este middleware deve validar o token e preencher
req.userId e req.userRole a partir do usuario autenticado.
*/
export function simulateAuth(req: Request, _res: Response, next: NextFunction) {
  const headerUserId = Number(req.header("x-user-id"));
  const headerRole = req.header("x-user-role");

  const request = req as AuthenticatedRequest;
  request.userId = Number.isInteger(headerUserId) && headerUserId > 0 ? headerUserId : 1;
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
