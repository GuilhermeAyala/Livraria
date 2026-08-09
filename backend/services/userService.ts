import { User } from "../models/user";
import {
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  criarUsuario,
  editarUsuario,
  excluirUsuario,
  listarUsuarios,
  type UsuarioData,
  type UsuarioUpdateData,
} from "../repositories/userRepository";

type UsuarioPayload = Partial<{
  nome: string;
  email: string;
  password: string;
  CPF: string;
  CEP: string;
}>;

const caracterEspecial = ["@", "!", "&", "*", "?", "#", "+", "-"];
const emailsValidos = ["outlook", "gmail", "yahoo", "hotmail"];

function validarUsuario(user: User) {
  const temCaracterEspecial = caracterEspecial.some((caracter) =>
    user.password.includes(caracter)
  );
  const temEmailValido = emailsValidos.some((email) =>
    user.email.includes(email)
  );

  if (!user.nome || !user.email || !user.password || !user.CPF || !user.CEP) {
    throw new Error("O usuario deve ter nome, email, senha, cep, cpf preenchidos");
  }
  if (user.CPF.length != 11) {
    throw new Error("CPF deve conter 11 caracteres");
  }
  if (!user.email.includes("@") || !temEmailValido) {
    throw new Error("Email deve ter @ e deve ter endereco valido");
  }
  if (user.password.length < 10 || !temCaracterEspecial) {
    throw new Error("A senha deve ter pelo menos 10 caracteres e um caractere especial");
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

function montarUser(payload: UsuarioPayload, id = 0) {
  return new User(
    id,
    normalizarTexto(payload.nome, "nome"),
    normalizarTexto(payload.email, "email"),
    normalizarTexto(payload.password, "password"),
    normalizarTexto(payload.CPF, "CPF"),
    normalizarTexto(payload.CEP, "CEP")
  );
}

function usuarioParaData(user: User): UsuarioData {
  return {
    nome: user.nome,
    email: user.email,
    senha: user.password,
    CPF: user.CPF,
    CEP: user.CEP,
  };
}

function montarAtualizacao(payload: UsuarioPayload): UsuarioUpdateData {
  const dados: UsuarioUpdateData = {};

  if (payload.nome !== undefined) {
    dados.nome = normalizarTexto(payload.nome, "nome");
  }
  if (payload.email !== undefined) {
    dados.email = normalizarTexto(payload.email, "email");
  }
  if (payload.password !== undefined) {
    dados.senha = normalizarTexto(payload.password, "password");
  }
  if (payload.CPF !== undefined) {
    dados.CPF = normalizarTexto(payload.CPF, "CPF");
  }
  if (payload.CEP !== undefined) {
    dados.CEP = normalizarTexto(payload.CEP, "CEP");
  }

  if (Object.keys(dados).length === 0) {
    throw new Error("Informe ao menos um campo para editar o usuario.");
  }

  return dados;
}

export async function listarUsuariosService() {
  return listarUsuarios();
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
    dados.nome ?? usuarioAtual.nome,
    dados.email ?? usuarioAtual.email,
    dados.senha ?? usuarioAtual.senha,
    dados.CPF ?? usuarioAtual.CPF,
    dados.CEP ?? usuarioAtual.CEP
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
