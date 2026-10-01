import { User } from "../models/user";
import { hashPassword } from "../auth";
import {
  buscarUsuarioPorEmail as buscarUsuarioPorEmailRepository,
  buscarUsuarioPorId,
  buscarUsuarioParaEdicao,
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
  CPF: string;
}>;

const caracterEspecial = ["@", "!", "&", "*", "?", "#", "+", "-"];
const emailsValidos = ["outlook", "gmail", "yahoo", "hotmail", "livraria"];

function validarUsuario(user: User) {
  const temEmailValido = emailsValidos.some((email) =>
    user.email.includes(email)
  );

  if (!user.name || !user.email || !user.passwordHash) {
    throw new Error("O usuario deve ter nome, email e senha preenchidos.");
  }
  if (!user.email.includes("@") || !temEmailValido) {
    throw new Error("Email deve ter @ e deve ter endereco valido.");
  }
  if (!user.passwordHash.startsWith("scrypt:")) {
    validarSenha(user.passwordHash);
  }
}

function validarSenha(password: string) {
  const temCaracterEspecial = caracterEspecial.some((caracter) => password.includes(caracter));
  if (password.length < 10 || !temCaracterEspecial) {
    throw new Error("A senha deve ter pelo menos 10 caracteres e um caractere especial.");
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
    normalizarTextoOpcional(payload.address ?? payload.CEP),
    normalizarTexto(payload.CPF, "CPF")
  );
}

function usuarioParaData(user: User): UsuarioData {
  return {
    name: user.name,
    email: user.email,
    passwordHash: hashPassword(user.passwordHash),
    address: user.address,
    CPF: user.CPF ?? "",
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
    const password = normalizarTexto(payload.passwordHash ?? payload.password, "password");
    validarSenha(password);
    dados.passwordHash = hashPassword(password);
  }
  if (payload.address !== undefined || payload.CEP !== undefined) {
    dados.address = normalizarTextoOpcional(payload.address ?? payload.CEP);
  }
  if (payload.CPF !== undefined) {
    dados.CPF = normalizarTexto(payload.CPF, "CPF");
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
  const usuarioComSenha = await buscarUsuarioParaEdicao(id);
  if (!usuarioComSenha) throw new Error("Usuario nao encontrado.");
  const dados = montarAtualizacao(payload);

  const usuarioEditado = new User(
    usuarioAtual.id,
    dados.name ?? usuarioAtual.name,
    dados.email ?? usuarioAtual.email,
    usuarioComSenha.passwordHash,
    dados.address ?? usuarioAtual.address ?? undefined,
    dados.CPF ?? usuarioComSenha.CPF ?? undefined
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

export async function LoginAuth(id: number, email: string, password: string){
    if(!email || !password){
      throw new Error("Email e senha devem existir");
    }
    
}

export async function excluirUsuarioService(id: number) {
  await buscarUsuarioPorIdService(id);
  return excluirUsuario(id);
}
