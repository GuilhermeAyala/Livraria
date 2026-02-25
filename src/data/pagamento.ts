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
    validade = new Date();
    marca: string;
    cvc: number;
    saldo: number;
    limite: number;

    constructor(id: number, metodoPagamento: string, nomeTitular: string, numeroCartao: string, validade: Date, marca: string, cvc: number, saldo: number, limite: number){
        super(id, metodoPagamento); 
        this.nomeTitular = nomeTitular;
        this.numeroCartao = numeroCartao;
        this.validade = validade;
        this.marca = marca;
        this.cvc = cvc;
        this.saldo = saldo;
        this.limite = limite;
    }
    
}

export class Pix extends Pagamento {
    chavePix: string;

    constructor(id: number, metodo: string, chavePix: string){
        super(id, metodo)
        this.chavePix = chavePix;
    }
}

const ValidarCartão = (nomeTitular: string, numeroCartao: string, validade: Date, marca: string, cvc: string, saldo: number, limite:number) => {
    const onlyLetters = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if(!nomeTitular || !numeroCartao || !validade || !marca || !cvc || !saldo || !limite){
        console.log("os dados devem existir")
    }   
    if(!onlyLetters.test(nomeTitular)) {
    console.log("Nome deve conter apenas letras");
    return false;
    }
    if(numeroCartao.length < 0 || numeroCartao.length > 12){
        return false;
    }
    if(cvc.length !== 3){
        return false;
    }
    saldo <= 0 ? false : console.log("Cartão com saldo");
    //continuar validações do cartão

}

const AdicionarCartão = (nomeTitular: string, numeroCartao: string, validade: Date, marca: string, cvc: string, saldo: number, limite:number) => {
    let add = ValidarCartão(nomeTitular, numeroCartao, validade, marca, cvc, saldo, limite);
    
   
}

const GerarChavePix = () => {
    let numerosPix = '1234567890';
    let letrasPix = 'abcdefghijklmnopqrstuv';


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