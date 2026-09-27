import type { Request, Response } from "express";
import {
  buscarUsuarioPorEmail,
  buscarUsuarioPorIdService,
  criarUsuarioService,
  editarUsuarioService,
  excluirUsuarioService,
  listarUsuariosService,
} from "../services/userService";

function getStatusCode(error: unknown) {
  if (!(error instanceof Error)) return 500;
  if (error.message.includes("nao encontrado")) return 404;
  return 400;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro interno do servidor.";
}

export async function buscarUsuarioDemoController(_req: Request, res: Response) {
  try {
    const usuario = await buscarUsuarioPorEmail("usuario1@livraria.local");
    if (!usuario) return res.status(404).json({ message: "Usuario demo nao encontrado." });

    return res.status(200).json({ id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role });
  } catch (error) {
    return res.status(500).json({ message: getErrorMessage(error) });
  }
}

export async function listarUsuariosController(_req: Request, res: Response) {
  try {
    const usuarios = await listarUsuariosService();
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: getErrorMessage(error) });
  }
}

export async function buscarUsuarioPorIdController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const usuario = await buscarUsuarioPorIdService(id);
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
  }
}

export async function criarUsuarioController(req: Request, res: Response) {
  try {
    const usuario = await criarUsuarioService(req.body);
    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
  }
}

export async function editarUsuarioController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const usuario = await editarUsuarioService(id, req.body);
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
  }
}

export async function excluirUsuarioController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await excluirUsuarioService(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: getErrorMessage(error) });
  }
}
