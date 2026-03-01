//pix, boleto, crédito, débito..., por hora
//definir caracteristicas e metodos de pagamento num geral
//depois cria classes únicas e suas especificações, pix com chave aleatória, cartão com cvc e etc

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

export class Pix extends Pagamento {
    chavePix: string;

    constructor(id: number, chavePix: string){
        super(id)
        this.chavePix = chavePix;
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

const GerarChavePix = (chavePix: string) => {
    let tamanho: number;
    let numerosPix: string  = '1234567890';
    let letrasPix: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv';
    chavePix = numerosPix + letrasPix;
    //for(let i: any; i < tamanho; i++){
    //    const indice = Math.floor(Math.random() * chavePix)

    //}

    //return chavePix; 
    //continuar depois
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