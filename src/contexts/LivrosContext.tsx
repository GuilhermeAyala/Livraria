import React, { createContext, useContext, useEffect, useState } from "react";
import { Book } from "../models/booksModel";

type LivroForm = {
  name: string;
  autor: string;
  year: number;
  price: number;
  quantity: number;
  isAvailable: boolean;
};

type LivrosContextType = {
  livros: Book[];
  carregando: boolean;
  erro: string;
  adicionarLivro: (livro: LivroForm) => Promise<void>;
  editarLivro: (id: number, dados: LivroForm) => Promise<void>;
  excluirLivro: (id: number) => Promise<void>;
  avaliarLivro: (id: number, rating: number) => Promise<void>;
};

const API_URL = "http://localhost:4000";
const LivrosContext = createContext<LivrosContextType | null>(null);

function criarBook(livro: any): Book {
  return new Book(
    Number(livro.id),
    livro.name,
    livro.autor,
    Number(livro.year),
    Number(livro.price),
    Number(livro.quantity ?? livro.quantidade ?? 0),
    Boolean(livro.isAvailable),
    livro.averageRating === null || livro.averageRating === undefined ? null : Number(livro.averageRating),
    Number(livro.ratingCount ?? 0),
    livro.myRating === null || livro.myRating === undefined ? null : Number(livro.myRating)
  );
}

async function request(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Nao foi possivel acessar os livros.");
  }

  return data;
}

export const LivrosProvider = ({ children }: { children: React.ReactNode }) => {
  const [livros, setLivros] = useState<Book[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    const carregarLivros = () => {
      setCarregando(true);
      request("/books")
        .then((data) => {
          if (ativo) {
            setLivros(Array.isArray(data) ? data.map(criarBook) : []);
            setErro("");
          }
        })
        .catch((error) => {
          if (ativo) setErro(error instanceof Error ? error.message : "Erro ao carregar livros.");
        })
        .finally(() => {
          if (ativo) setCarregando(false);
        });
    };

    carregarLivros();
    window.addEventListener("livraria:user-changed", carregarLivros);

    return () => {
      ativo = false;
      window.removeEventListener("livraria:user-changed", carregarLivros);
    };
  }, []);

  const adicionarLivro = async (livro: LivroForm) => {
    const data = await request("/books", { method: "POST", body: JSON.stringify(livro) });
    setLivros((atuais) => [...atuais, criarBook(data)]);
  };

  const editarLivro = async (id: number, dados: LivroForm) => {
    const data = await request(`/books/${id}`, { method: "PUT", body: JSON.stringify(dados) });
    setLivros((atuais) => atuais.map((livro) => (livro.id === id ? criarBook(data) : livro)));
  };

  const excluirLivro = async (id: number) => {
    await request(`/books/${id}`, { method: "DELETE" });
    setLivros((atuais) => atuais.filter((livro) => livro.id !== id));
  };

  const avaliarLivro = async (id: number, rating: number) => {
    const data = await request(`/books/${id}/ratings`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    });
    setLivros((atuais) => atuais.map((livro) => (livro.id === id ? criarBook(data) : livro)));
  };

  return (
    <LivrosContext.Provider value={{ livros, carregando, erro, adicionarLivro, editarLivro, excluirLivro, avaliarLivro }}>
      {children}
    </LivrosContext.Provider>
  );
};

export const useLivros = () => {
  const contexto = useContext(LivrosContext);

  if (!contexto) throw new Error("useLivros deve ser usado dentro de LivrosProvider");
  return contexto;
};
