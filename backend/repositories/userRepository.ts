import { prisma } from "../prismaClient";

export type UsuarioData = {
  name: string;
  email: string;
  passwordHash: string;
  address?: string;
  CPF: string;
};

export type UsuarioUpdateData = Partial<UsuarioData>;

export async function listarUsuarios() {
  return prisma.user.findMany({
    orderBy: { id: "asc" },
    select: { id: true, name: true, email: true, role: true, address: true, createdAt: true, updatedAt: true },
  });
}

export async function buscarUsuarioPorId(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, address: true, createdAt: true, updatedAt: true },
  });
}

export async function buscarUsuarioParaEdicao(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function buscarUsuarioPorEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, address: true, createdAt: true, updatedAt: true },
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
