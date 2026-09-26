import { prisma } from "../prismaClient";

export type UsuarioData = {
  name: string;
  email: string;
  passwordHash: string;
  address?: string;
};

export type UsuarioUpdateData = Partial<UsuarioData>;

export async function listarUsuarios() {
  return prisma.user.findMany({
    orderBy: { id: "asc" },
  });
}

export async function buscarUsuarioPorId(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function buscarUsuarioPorEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function criarUsuario(dados: UsuarioData) {
  return prisma.user.create({
    data: dados,
  });
}

export async function editarUsuario(id: number, dados: UsuarioUpdateData) {
  return prisma.user.update({
    where: { id },
    data: dados,
  });
}

export async function excluirUsuario(id: number) {
  return prisma.user.delete({
    where: { id },
  });
}
