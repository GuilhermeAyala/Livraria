import { User } from "../models/user";
import {
  buscarUsuarioPorEmail as buscarUsuarioPorEmailRepository,
  buscarUsuarioPorId,
  criarUsuario,
  editarUsuario,
  excluirUsuario,
  listarUsuarios,
  type UsuarioData,
  type UsuarioUpdateData,
} from "../repositories/userRepository";

type UsuarioPayload = Partial<{
  name: string;
  nome: string;
  email: string;
  password: string;
  passwordHash: string;
  address: string;
  CEP: string;
}>;

const caracterEspecial = ["@", "!", "&", "*", "?", "#", "+", "-"];
const emailsValidos = ["outlook", "gmail", "yahoo", "hotmail", "livraria"];

function validarUsuario(user: User) {
  const temCaracterEspecial = caracterEspecial.some((caracter) =>
    user.passwordHash.includes(caracter)
  );
  const temEmailValido = emailsValidos.some((email) =>
    user.email.includes(email)
  );

  if (!user.name || !user.email || !user.passwordHash) {
    throw new Error("O usuario deve ter nome, email e senha preenchidos.");
  }
  if (!user.email.includes("@") || !temEmailValido) {
    throw new Error("Email deve ter @ e deve ter endereco valido.");
  }
  if (user.passwordHash.length < 4 || !temCaracterEspecial) {
    throw new Error("A senha deve ter pelo menos 4 caracteres e um caractere especial.");
  }
}

function validarId(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Id do usuario invalido.");
  }
}

function normalizarTexto(valor: string | undefined, campo: string) {
  if (typeof valor !== "string" || !valor.trim()) {
    throw new Error(`O campo ${campo} deve ser preenchido.`);
  }

  return valor.trim();
}

function normalizarTextoOpcional(valor: string | undefined) {
  return typeof valor === "string" && valor.trim() ? valor.trim() : undefined;
}

function montarUser(payload: UsuarioPayload, id = 0) {
  return new User(
    id,
    normalizarTexto(payload.name ?? payload.nome, "name"),
    normalizarTexto(payload.email, "email"),
    normalizarTexto(payload.passwordHash ?? payload.password, "password"),
    normalizarTextoOpcional(payload.address ?? payload.CEP)
  );
}

function usuarioParaData(user: User): UsuarioData {
  return {
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    address: user.address,
  };
}

function montarAtualizacao(payload: UsuarioPayload): UsuarioUpdateData {
  const dados: UsuarioUpdateData = {};

  if (payload.name !== undefined || payload.nome !== undefined) {
    dados.name = normalizarTexto(payload.name ?? payload.nome, "name");
  }
  if (payload.email !== undefined) {
    dados.email = normalizarTexto(payload.email, "email");
  }
  if (payload.passwordHash !== undefined || payload.password !== undefined) {
    dados.passwordHash = normalizarTexto(payload.passwordHash ?? payload.password, "password");
  }
  if (payload.address !== undefined || payload.CEP !== undefined) {
    dados.address = normalizarTextoOpcional(payload.address ?? payload.CEP);
  }

  if (Object.keys(dados).length === 0) {
    throw new Error("Informe ao menos um campo para editar o usuario.");
  }

  return dados;
}

export async function listarUsuariosService() {
  return listarUsuarios();
}

export async function buscarUsuarioPorEmail(email: string) {
  return buscarUsuarioPorEmailRepository(email);
}

export async function buscarUsuarioPorIdService(id: number) {
  validarId(id);

  const usuario = await buscarUsuarioPorId(id);

  if (!usuario) {
    throw new Error("Usuario nao encontrado.");
  }

  return usuario;
}

export async function criarUsuarioService(payload: UsuarioPayload) {
  const user = montarUser(payload);
  validarUsuario(user);

  const usuarioExistente = await buscarUsuarioPorEmail(user.email);

  if (usuarioExistente) {
    throw new Error("Ja existe um usuario cadastrado com esse email.");
  }

  return criarUsuario(usuarioParaData(user));
}

export async function editarUsuarioService(id: number, payload: UsuarioPayload) {
  const usuarioAtual = await buscarUsuarioPorIdService(id);
  const dados = montarAtualizacao(payload);

  const usuarioEditado = new User(
    usuarioAtual.id,
    dados.name ?? usuarioAtual.name,
    dados.email ?? usuarioAtual.email,
    dados.passwordHash ?? usuarioAtual.passwordHash,
    dados.address ?? usuarioAtual.address ?? undefined
  );

  validarUsuario(usuarioEditado);

  if (dados.email && dados.email !== usuarioAtual.email) {
    const usuarioComMesmoEmail = await buscarUsuarioPorEmail(dados.email);

    if (usuarioComMesmoEmail) {
      throw new Error("Ja existe um usuario cadastrado com esse email.");
    }
  }

  return editarUsuario(id, dados);
}

export async function excluirUsuarioService(id: number) {
  await buscarUsuarioPorIdService(id);
  return excluirUsuario(id);
}
