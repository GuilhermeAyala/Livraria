import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  role?: "USER" | "ADMIN";
};

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const location = useLocation();
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <p>Verificando sua sessao...</p>;
  }

  if (!usuario) {
    return <Navigate to="/" replace state={{ message: "Entre para acessar essa pagina." }} />;
  }

  if (role && usuario.role !== role) {
    return <Navigate to={usuario.role === "ADMIN" ? "/admin" : "/user"} replace />;
  }

  return <>{children}</>;
}
