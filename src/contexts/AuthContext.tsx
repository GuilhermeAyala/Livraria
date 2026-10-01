import React, { createContext, useContext, useEffect, useState } from "react";

export type UsuarioAutenticado = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  address: string | null;
};

type AuthContextType = {
  usuario: UsuarioAutenticado | null;
  carregando: boolean;
  login: (email: string, password: string) => Promise<UsuarioAutenticado>;
  logout: () => Promise<void>;
};

const API_URL = "http://localhost:4000";
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.user as UsuarioAutenticado;
      })
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Nao foi possivel entrar.");
    }

    const usuarioLogado = data.user as UsuarioAutenticado;
    setUsuario(usuarioLogado);
    window.dispatchEvent(new Event("livraria:user-changed"));
    return usuarioLogado;
  };

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
    setUsuario(null);
    window.dispatchEvent(new Event("livraria:user-changed"));
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return contexto;
}
