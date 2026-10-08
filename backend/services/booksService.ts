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
  quantity: number;
  quantidade: number;
  isAvailable: boolean;
}>;

type RatingPayload = {
  rating?: unknown;
};

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
    quantity: normalizarInteiro(payload.quantity ?? payload.quantidade, "quantity"),
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
  if (payload.quantity !== undefined || payload.quantidade !== undefined) {
    data.quantity = normalizarInteiro(payload.quantity ?? payload.quantidade, "quantity");
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

  listarLivros(userId?: number, includeUnavailable = false) {
    return this.booksRepository.findAll(userId, includeUnavailable);
  }

  async getLivroById(id: number, userId?: number) {
    validarId(id);

    const book = await this.booksRepository.findById(id, userId);

    if (!book) {
      throw new Error("Livro nao encontrado.");
    }

    return book;
  }

  async avaliarLivro(id: number, userId: number, payload: RatingPayload) {
    validarId(id);
    validarId(userId);

    const livro = await this.booksRepository.findById(id, userId);
    if (!livro) {
      throw new Error("Livro nao encontrado.");
    }

    const usuario = await this.booksRepository.findUserById(userId);
    if (!usuario) {
      throw new Error("Usuario nao encontrado.");
    }

    const rating = Number(payload.rating);
    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      throw new Error("A avaliacao deve ser um numero inteiro entre 0 e 5.");
    }

    return this.booksRepository.upsertRating(id, userId, rating);
  }

  criarLivro(payload: BookPayload) {
    const data = montarLivro(payload);
    return this.booksRepository.create(data);
  }

  async atualizarLivro(id: number, payload: BookPayload) {
    await this.getLivroById(id);
    const data = montarAtualizacao(payload);
    const updatedBook = await this.booksRepository.update(id, data);

    if (!updatedBook) {
      throw new Error("Livro nao encontrado.");
    }

    return updatedBook;
  }

  async deletarLivro(id: number) {
    validarId(id);

    await this.getLivroById(id);
    await this.booksRepository.delete(id);
  }
}
