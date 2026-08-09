import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const usuarioRepository = (prisma as any).user;

export type UsuarioData = {
  nome: string;
  email: string;
  senha: string;
  CPF: string;
  CEP: string;
};

export type UsuarioUpdateData = Partial<UsuarioData>;

export async function listarUsuarios() {
  return usuarioRepository.findMany({
    orderBy: { id: "asc" },
  });
}

export async function buscarUsuarioPorId(id: number) {
  return usuarioRepository.findUnique({
    where: { id },
  });
}

export async function buscarUsuarioPorEmail(email: string) {
  return usuarioRepository.findUnique({
    where: { email },
  });
}

export async function criarUsuario(dados: UsuarioData) {
  return usuarioRepository.create({
    data: dados,
  });
}

export async function editarUsuario(id: number, dados: UsuarioUpdateData) {
  return usuarioRepository.update({
    where: { id },
    data: dados,
  });
}

export async function excluirUsuario(id: number) {
  return usuarioRepository.delete({
    where: { id },
  });
}
