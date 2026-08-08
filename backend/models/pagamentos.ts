export enum Pagamentos {
    Credito,
    Debito,
    Pix,
    Boleto 
}

export class Pagamento {
    id: number;

    constructor(id: number){
        this.id = id;
    }
}

export class Cartao_Debito extends Pagamento {
    nomeTitular: string;
    numeroCartao: string;
    validade: Date;
    marca: string;
    cvc: string;
    saldo: number;

    constructor(id: number, nomeTitular: string, numeroCartao: string, validade: Date, marca: string, cvc: string, saldo: number){
        super(id);
        this.nomeTitular = nomeTitular;
        this.numeroCartao = numeroCartao;
        this.validade = validade;
        this.marca = marca;
        this.cvc = cvc;
        this.saldo = saldo;
    }
}

export class Cartao_Credito extends Pagamento {
    nomeTitular: string;
    numeroCartao: string;
    validade = new Date();
    marca: string;
    cvc: string;
    saldo: number;
    limite: number;

    constructor(id: number, nomeTitular: string, numeroCartao: string, validade: Date, marca: string, cvc: string, saldo: number, limite: number){
        super(id); 
        this.nomeTitular = nomeTitular;
        this.numeroCartao = numeroCartao;
        this.validade = validade;
        this.marca = marca;
        this.cvc = cvc;
        this.saldo = saldo;
        this.limite = limite;
    }
    
}

export class Boleto extends Pagamento {
    tempoValidade: number;
    vencimento: number;
    codigoBarras: string;
    statusBoleto: object = { 
        pendente : "pendente",
        ativo: "ativo",
        vencido: "vencido",
        pago: "pago"
    }
    constructor(id:number, tempoValidade: number, vencimento: number, codigoBarras: string, statusBoleto: object){
        super(id);
        this.tempoValidade = tempoValidade;
        this.vencimento = vencimento;
        this.codigoBarras = codigoBarras;
        this.statusBoleto = statusBoleto;
    } 

}