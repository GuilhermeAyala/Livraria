//pix, boleto, crédito, débito..., por hora
//definir caracteristicas e metodos de pagamento num geral
//depois cria classes únicas e suas especificações, pix com chave aleatória, cartão com cvc e etc

export class Pagamento {
    id: number;
    metodoPagamento: string;

    constructor(id: number, metodoPagamento: string){
        this.id = id;
        this.metodoPagamento = metodoPagamento;

    }
}

export class Cartao_Credito extends Pagamento {
    nomeTitular: string;
    numeroCartao: string;
    validade: string;
    marca: string;
    cvc: number;
    saldo: number;

    constructor(id: number, metodoPagamento: string, nomeTitular: string, numeroCartao: string, validade: string, marca: string, cvc: number, saldo: number){
        super(id, metodoPagamento); 
        this.nomeTitular = nomeTitular;
        this.numeroCartao = numeroCartao;
        this.validade = validade;
        this.marca = marca;
        this.cvc = cvc;
        this.saldo = saldo;
    }
    
}

export class Pix extends Pagamento {
    chavePix: string;

    constructor(id: number, metodo: string, chavePix: string){
        super(id, metodo)
        this.chavePix = chavePix;
    }
}

const ValidarCartão = (nomeTitular: string, numeroCartao: string, validade: string, marca: string, cvc: number, saldo: number) => {
    if(!nomeTitular || !numeroCartao || !validade || !marca || !cvc || !saldo){
        console.log("os dados devem existir")
    }
    if(numeroCartao.length < 0 || numeroCartao.length > 12){
        return false;
    }
    //continuar validações do cartão

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