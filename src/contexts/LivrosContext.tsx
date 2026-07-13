import React, { createContext, useContext, useEffect, useState } from "react";
import { books as livrosIniciais } from "../data/books";
import { Book } from "../models/booksModel";

type LivroForm = {
  name: string;
  autor: string;
  year: number;
  price: number;
  quantidade: number;
  isAvailable: boolean;
};

type LivrosContextType = {
  livros: Book[];
  adicionarLivro: (livro: LivroForm) => void;
  editarLivro: (id: number, dados: LivroForm) => void;
  excluirLivro: (id: number) => void;
};

const STORAGE_KEY = "livros_admin";
const LivrosContext = createContext<LivrosContextType | null>(null);

function criarBook(livro: Book): Book {
  return new Book(
    livro.id,
    livro.name,
    livro.autor,
    livro.year,
    livro.price,
    livro.quantidade,
    livro.isAvailable
  );
}

function reordenarIds(livros: Book[]): Book[] {
  return livros.map(
    (livro, index) =>
      new Book(
        index,
        livro.name,
        livro.autor,
        livro.year,
        livro.price,
        livro.quantidade,
        livro.isAvailable
      )
  );
}

export const LivrosProvider = ({ children }: { children: React.ReactNode }) => {
  const [livros, setLivros] = useState<Book[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return livrosIniciais.map(criarBook);

      const livrosSalvos = JSON.parse(raw) as Book[];
      return livrosSalvos.map(criarBook);
    } catch {
      return livrosIniciais.map(criarBook);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(livros));
    } catch {}
  }, [livros]);

  const adicionarLivro = (livro: LivroForm) => {
    setLivros((livrosAtuais) => {
      const maiorId = livrosAtuais.reduce((maior, item) => Math.max(maior, item.id), -1);
      return [
        ...livrosAtuais,
        new Book(
          maiorId + 1,
          livro.name,
          livro.autor,
          livro.year,
          livro.price,
          livro.quantidade,
          livro.isAvailable
        ),
      ];
    });
  };

  const editarLivro = (id: number, dados: LivroForm) => {
    setLivros((livrosAtuais) =>
      livrosAtuais.map((livro) =>
        livro.id === id
          ? new Book(
              id,
              dados.name,
              dados.autor,
              dados.year,
              dados.price,
              dados.quantidade,
              dados.isAvailable
            )
          : livro
      )
    );
  };

  const excluirLivro = (id: number) => {
    setLivros((livrosAtuais) =>
      reordenarIds(livrosAtuais.filter((livro) => livro.id !== id))
    );
  };

  return (
    <LivrosContext.Provider
      value={{ livros, adicionarLivro, editarLivro, excluirLivro }}
    >
      {children}
    </LivrosContext.Provider>
  );
};

export const useLivros = () => {
  const contexto = useContext(LivrosContext);

  if (!contexto) {
    throw new Error("useLivros deve ser usado dentro de LivrosProvider");
  }

  return contexto;
};
