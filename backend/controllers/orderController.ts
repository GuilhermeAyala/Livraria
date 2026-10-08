import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/session";
import { OrderService } from "../services/orderService";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro interno do servidor.";
}

function getStatusCode(error: unknown) {
  const message = getErrorMessage(error);
  if (message.includes("nao autenticado")) return 401;
  if (message.includes("nao encontrado")) return 404;
  if (message.includes("nao pode acessar") || message.includes("nao pode cancelar")) return 403;
  return 400;
}

export class OrderController {
  constructor(private orderService: OrderService) {}

  list = async (req: AuthenticatedRequest, res: Response) => {
    try {
      return res.json(await this.orderService.listarPedidos(req.userId!, req.userRole === "ADMIN"));
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      return res.json(await this.orderService.buscarPedido(Number(req.params.id), req.userId!, req.userRole === "ADMIN"));
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  create = async (req: AuthenticatedRequest, res: Response) => {
    try {
      return res.status(201).json(await this.orderService.criarPedido(req.userId!, req.body));
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
      return res.json(await this.orderService.atualizarStatus(Number(req.params.id), req.body));
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };

  cancel = async (req: AuthenticatedRequest, res: Response) => {
    try {
      return res.json(await this.orderService.cancelarPedido(Number(req.params.id), req.userId!, req.userRole === "ADMIN"));
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
    }
  };
}
