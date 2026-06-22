type LivroComQuantidade = {
  quantidade: number;
};

export function existeLivro<T>(livro: T | null | undefined): T {
  if (!livro) {
    throw new Error("O livro nao existe");
  }

  return livro;
}

export function validarQuantidade(livro: LivroComQuantidade): void {
  if (livro.quantidade <= 0) {
    throw new Error("Livro indisponivel, quantidade insuficiente");
  }
}
