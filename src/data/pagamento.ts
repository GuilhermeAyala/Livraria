//pix, boleto, crédito, débito..., por hora
//definir caracteristicas e metodos de pagamento num geral
//depois cria classes únicas e suas especificações, cartão com cvc e etc
export class Pagamento {
    id: number;

    constructor(id: number){
        this.id = id;
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

const AdicionarCartão = (id: number, nomeTitular: string, numeroCartao: string, validade: Date, marca: string, cvc: string, saldo: number, limite:number) => {
    const ValidarCartão = (nomeTitular: string, numeroCartao: string, validade: Date, marca: string, cvc: string, saldo: number, limite:number) => {
        const onlyLetters = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

        if(!nomeTitular || !numeroCartao || !validade || !marca || !cvc || !saldo || !limite){
            throw new Error("os dados devem existir");
        }   
        if(!onlyLetters.test(nomeTitular)) {
            throw new Error("Nome deve conter apenas letras");
        }
        if(numeroCartao.length !== 16){
            throw new Error("O cartão deve conter 16 numeros")
        }
        if(validade < new Date()){
            throw new Error("Cartão vencido")
        }
        if(cvc.length !== 3){
            throw new Error("Cvc deve ser igual a 3");
        }
        if(saldo === undefined || saldo === null || saldo <= 0){
            throw new Error("Saldo não pode ser negativo")
        }
        if(limite < 0){
            throw new Error("O limite deve ser maior que zero")
        }

    }

    ValidarCartão(nomeTitular, numeroCartao, validade, marca, cvc, saldo, limite)

    return {
        id, 
        nomeTitular, 
        numeroCartao, 
        validade, 
        marca, 
        cvc, 
        saldo, 
        limite
    }

}

const GerarBoleto = (tempoValidade: number, vencimento: number, codigoBarras: string, statusBoleto: object) => {
    const ValidarBoleto = (tempoValidade: number, vencimento: number, codigoBarras: string, statusBoleto: object) => {
        let values = Object.keys(statusBoleto);

        if(tempoValidade < vencimento){
            setTimeout(() => {
                console.log("esperando pagamento");
                values = Object.keys("pendente");
            }, 24 * 60 * 60 * 1000)//depois de 24 hrs
        }
        else if(tempoValidade > vencimento){
            values = Object.keys("vencido");
        }
    }
    return Boleto;
}

//export function FazerPagamento(desconto: number, dinheiroDisponivel: number, pagamento, metodoPagamento: string, total){
    //total = ComprarLivro(total);
    //metodoPagamento = "Dinheiro";

    //switch(metodoPagamento){
    //    case "Cartão de Crédito":
    //        desconto = 0.10
    //        pagamento = ComprarLivro(total) - (total * desconto);
    //        console.log(`O valor total a ser pago é igual a ${pagamento}`);
    //        break;
    //       
    //}
    //console.log("Compra finalizada!");
    //console.log(`Seu método de pagamento é ${metodoPagamento}`);
    //return{
    //    sucesso: true,
    //    metodoPagamento, 
    //    total, 
    //};

//checks: Função AdicionarCartão e ValidarCartão estão funcionando