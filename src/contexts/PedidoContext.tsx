import React, { createContext, useContext, useEffect, useState } from "react";

export type StatusPedido = {
  titulo: string;
  descricao: string;
};

export const statusPedido: StatusPedido[] = [
  {
    titulo: "Aguardando Pagamento",
    descricao:
      "O pedido foi criado, mas o pagamento via boleto, Pix ou cartao ainda esta sendo processado.",
  },
  {
    titulo: "Pagamento em Analise",
    descricao:
      "A loja esta verificando os dados do cartao por motivos de seguranca.",
  },
  {
    titulo: "Pedido Pago / Faturado",
    descricao: "O pagamento foi aprovado e a nota fiscal foi emitida.",
  },
  {
    titulo: "Em Separacao / Preparando",
    descricao:
      "O produto esta sendo embalado e preparado no centro de distribuicao.",
  },
  {
    titulo: "Enviado / Despachado",
    descricao:
      "O pacote foi entregue a transportadora e esta a caminho do seu endereco.",
  },
  {
    titulo: "Saiu para Entrega",
    descricao:
      "O produto esta no veiculo de entrega com o motorista para ser entregue no dia.",
  },
  {
    titulo: "Entregue",
    descricao: "O pacote chegou ao destinatario.",
  },
];

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
