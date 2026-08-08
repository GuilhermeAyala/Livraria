export type StatusPedidoInfo = {
  titulo: string;
  descricao: string;
};

export const statusPedido: StatusPedidoInfo[] = [
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
