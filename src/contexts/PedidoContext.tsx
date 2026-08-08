import React, { createContext, useContext, useEffect, useState } from "react";
import { statusPedido } from "../constants/statusPedido";

export { statusPedido };

export type Pedido = {
  id: string;
  valor: number;
  metodoPagamento: string;
  statusAtual: number;
  criadoEm: string;
  codigoBarras?: string;
};

type NovoPedido = {
  valor: number;
  metodoPagamento: string;
  statusAtual: number;
  codigoBarras?: string;
};

type PedidoContextType = {
  pedido: Pedido | null;
  criarPedido: (novoPedido: NovoPedido) => Pedido;
  atualizarStatusPedido: (statusAtual: number) => void;
  cancelarPedido: () => void;
};

const STORAGE_KEY = "pedido_ativo";
const PedidoContext = createContext<PedidoContextType | null>(null);

export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {
  const [pedido, setPedido] = useState<Pedido | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (pedido) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pedido));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [pedido]);

  const criarPedido = (novoPedido: NovoPedido) => {
    const pedidoCriado: Pedido = {
      id: `LV-${Date.now()}`,
      criadoEm: new Date().toISOString(),
      ...novoPedido,
    };

    setPedido(pedidoCriado);
    return pedidoCriado;
  };

  const cancelarPedido = () => {
    setPedido(null);
  };

  const atualizarStatusPedido = (statusAtual: number) => {
    if (statusAtual < 0 || statusAtual >= statusPedido.length) return;

    setPedido((pedidoAtual) =>
      pedidoAtual ? { ...pedidoAtual, statusAtual } : pedidoAtual
    );
  };

  return (
    <PedidoContext.Provider
      value={{ pedido, criarPedido, atualizarStatusPedido, cancelarPedido }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export const usePedido = () => {
  const contexto = useContext(PedidoContext);

  if (!contexto) {
    throw new Error("usePedido deve ser usado dentro de PedidoProvider");
  }

  return contexto;
};
