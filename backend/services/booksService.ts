import {
  BooksRepository,
  type BookCreateData,
  type BookUpdateData,
} from "../repositories/booksRepository";

type BookPayload = Partial<{
  name: string;
  nome: string;
  autor: string;
  year: number;
  ano: number;
  price: number;
  valor: number;
  quantidade: number;
  isAvailable: boolean;
}>;

function validarId(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Id do livro invalido.");
  }
}

function normalizarTexto(valor: unknown, campo: string) {
  if (typeof valor !== "string" || !valor.trim()) {
    throw new Error(`O campo ${campo} deve ser preenchido.`);
  }

  return valor.trim();
}

function normalizarNumero(valor: unknown, campo: string, permiteZero = false) {
  const numero = Number(valor);
  const minimoValido = permiteZero ? numero >= 0 : numero > 0;

  if (!Number.isFinite(numero) || !minimoValido) {
    throw new Error(`O campo ${campo} deve ser um numero ${permiteZero ? "maior ou igual a zero" : "maior que zero"}.`);
  }

  return numero;
}

function normalizarInteiro(valor: unknown, campo: string) {
  const numero = normalizarNumero(valor, campo);

  if (!Number.isInteger(numero)) {
    throw new Error(`O campo ${campo} deve ser um numero inteiro.`);
  }

  return numero;
}

function montarLivro(payload: BookPayload): BookCreateData {
  return {
    name: normalizarTexto(payload.name ?? payload.nome, "name"),
    autor: normalizarTexto(payload.autor, "autor"),
    year: normalizarInteiro(payload.year ?? payload.ano, "year"),
    price: normalizarNumero(payload.price ?? payload.valor, "price", true),
    quantidade: normalizarInteiro(payload.quantidade, "quantidade"),
    isAvailable: payload.isAvailable ?? true,
  };
}

function montarAtualizacao(payload: BookPayload): BookUpdateData {
  const data: BookUpdateData = {};

  if (payload.name !== undefined || payload.nome !== undefined) {
    data.name = normalizarTexto(payload.name ?? payload.nome, "name");
  }
  if (payload.autor !== undefined) {
    data.autor = normalizarTexto(payload.autor, "autor");
  }
  if (payload.year !== undefined || payload.ano !== undefined) {
    data.year = normalizarInteiro(payload.year ?? payload.ano, "year");
  }
  if (payload.price !== undefined || payload.valor !== undefined) {
    data.price = normalizarNumero(payload.price ?? payload.valor, "price", true);
  }
  if (payload.quantidade !== undefined) {
    data.quantidade = normalizarInteiro(payload.quantidade, "quantidade");
  }
  if (payload.isAvailable !== undefined) {
    data.isAvailable = Boolean(payload.isAvailable);
  }

  if (Object.keys(data).length === 0) {
    throw new Error("Informe ao menos um campo para editar o livro.");
  }

  return data;
}

export class BooksService {
  constructor(private booksRepository: BooksRepository) {}

  listarLivros() {
    return this.booksRepository.findAll();
  }

  getLivroById(id: number) {
    validarId(id);

    const book = this.booksRepository.findById(id);

    if (!book) {
      throw new Error("Livro nao encontrado.");
    }

    return book;
  }

  criarLivro(payload: BookPayload) {
    const data = montarLivro(payload);
    return this.booksRepository.create(data);
  }

  atualizarLivro(id: number, payload: BookPayload) {
    this.getLivroById(id);
    const data = montarAtualizacao(payload);
    const updatedBook = this.booksRepository.update(id, data);

    if (!updatedBook) {
      throw new Error("Livro nao encontrado.");
    }

    return updatedBook;
  }

  deletarLivro(id: number) {
    validarId(id);

    const deleted = this.booksRepository.delete(id);

    if (!deleted) {
      throw new Error("Livro nao encontrado.");
    }
  }
}
