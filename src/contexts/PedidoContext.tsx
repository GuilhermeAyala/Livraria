import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { statusPedido } from "../constants/statusPedido";

export { statusPedido };

export type PedidoStatus =
  | "AGUARDANDO_PAGAMENTO"
  | "PAGAMENTO_EM_ANALISE"
  | "PAGO"
  | "EM_SEPARACAO"
  | "ENVIADO"
  | "SAIU_PARA_ENTREGA"
  | "ENTREGUE"
  | "CANCELADO";

export type Pedido = {
  id: string;
  valor: number;
  subtotal: number;
  desconto: number;
  metodoPagamento: string;
  status: PedidoStatus;
  statusAtual: number;
  criadoEm: string;
  codigoBarras?: string;
  itens: {
    id: number;
    nome: string;
    quantidade: number;
    valorUnitario: number;
  }[];
  cliente?: {
    id: number;
    nome: string;
    email: string;
  };
};

type NovoPedido = {
  paymentMethod: "CREDITO" | "DEBITO" | "PIX" | "BOLETO";
};

type PedidoContextType = {
  pedidos: Pedido[];
  pedido: Pedido | null;
  carregando: boolean;
  erro: string;
  selecionarPedido: (id: string) => void;
  atualizarPedidos: () => Promise<void>;
  criarPedido: (novoPedido: NovoPedido) => Promise<Pedido>;
  atualizarStatusPedido: (statusAtual: number, pedidoId?: string) => Promise<void>;
  cancelarPedido: (pedidoId?: string) => Promise<void>;
};

type OrderApi = {
  id: number;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "CREDITO" | "DEBITO" | "PIX" | "BOLETO";
  paymentReference?: string | null;
  status: PedidoStatus;
  statusIndex: number;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  items?: {
    id: number;
    quantity: number;
    unitPrice: number;
    book: {
      id: number;
      name: string;
    };
  }[];
};

const API_URL = "http://localhost:4000";
const REFRESH_INTERVAL_MS = 10_000;
const PedidoContext = createContext<PedidoContextType | null>(null);

const nomesPagamento: Record<OrderApi["paymentMethod"], string> = {
  CREDITO: "Credito",
  DEBITO: "Debito",
  PIX: "Pix",
  BOLETO: "Boleto",
};

function mapearPedido(order: OrderApi): Pedido {
  return {
    id: String(order.id),
    valor: Number(order.total),
    subtotal: Number(order.subtotal),
    desconto: Number(order.discount),
    metodoPagamento: nomesPagamento[order.paymentMethod],
    status: order.status,
    statusAtual: Number(order.statusIndex),
    criadoEm: order.createdAt,
    codigoBarras: order.paymentReference ?? undefined,
    itens: Array.isArray(order.items)
      ? order.items.map((item) => ({
        id: item.book.id,
        nome: item.book.name,
        quantidade: Number(item.quantity),
        valorUnitario: Number(item.unitPrice),
      }))
      : [],
    cliente: order.user
      ? { id: order.user.id, nome: order.user.name, email: order.user.email }
      : undefined,
  };
}

async function request(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Nao foi possivel acessar os pedidos.");
  return data;
}

export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {
  const { usuario, carregando: carregandoAuth } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoSelecionadoId, setPedidoSelecionadoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const pedido = useMemo(
    () => pedidos.find((item) => item.id === pedidoSelecionadoId) ?? pedidos[0] ?? null,
    [pedidos, pedidoSelecionadoId],
  );

  const atualizarPedidos = useCallback(async () => {
    if (!usuario) {
      setPedidos([]);
      setPedidoSelecionadoId(null);
      setCarregando(false);
      return;
    }

    try {
      const orders = await request("/orders") as OrderApi[];
      const pedidosAtualizados = Array.isArray(orders) ? orders.map(mapearPedido) : [];
      setPedidos(pedidosAtualizados);
      setPedidoSelecionadoId((idAtual) => {
        if (idAtual && pedidosAtualizados.some((item) => item.id === idAtual)) return idAtual;
        return pedidosAtualizados[0]?.id ?? null;
      });
      setErro("");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Nao foi possivel carregar os pedidos.");
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  useEffect(() => {
    if (carregandoAuth) return undefined;

    setCarregando(true);
    void atualizarPedidos();
    if (!usuario) return undefined;

    const intervalId = window.setInterval(() => void atualizarPedidos(), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [atualizarPedidos, carregandoAuth, usuario]);

  const criarPedido = async (novoPedido: NovoPedido) => {
    const order = await request("/orders", {
      method: "POST",
      body: JSON.stringify(novoPedido),
    });
    const pedidoCriado = mapearPedido(order as OrderApi);
    setPedidos((atuais) => [pedidoCriado, ...atuais.filter((item) => item.id !== pedidoCriado.id)]);
    setPedidoSelecionadoId(pedidoCriado.id);
    return pedidoCriado;
  };

  const atualizarStatusPedido = async (statusAtual: number, pedidoId?: string) => {
    const id = pedidoId ?? pedido?.id;
    if (!id || statusAtual < 0 || statusAtual >= statusPedido.length) return;
    const order = await request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ statusIndex: statusAtual }),
    });
    const pedidoAtualizado = mapearPedido(order as OrderApi);
    setPedidos((atuais) => atuais.map((item) => item.id === id ? pedidoAtualizado : item));
  };

  const cancelarPedido = async (pedidoId?: string) => {
    const id = pedidoId ?? pedido?.id;
    if (!id) return;
    const order = await request(`/orders/${id}/cancel`, { method: "POST" });
    const pedidoCancelado = mapearPedido(order as OrderApi);
    setPedidos((atuais) => atuais.map((item) => item.id === id ? pedidoCancelado : item));
  };

  const selecionarPedido = (id: string) => setPedidoSelecionadoId(id);

  return (
    <PedidoContext.Provider
      value={{
        pedidos,
        pedido,
        carregando,
        erro,
        selecionarPedido,
        atualizarPedidos,
        criarPedido,
        atualizarStatusPedido,
        cancelarPedido,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export const usePedido = () => {
  const contexto = useContext(PedidoContext);
  if (!contexto) throw new Error("usePedido deve ser usado dentro de PedidoProvider");
  return contexto;
};
