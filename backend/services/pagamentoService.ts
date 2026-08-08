import { Pagamentos, Cartao_Debito, Cartao_Credito, Boleto} from '../models/pagamentos';

export function gerarCodigoBarras(tamanho = 48): string {
  const digits = "0123456789";
  return Array.from({ length: tamanho })
    .map(() => digits[Math.floor(Math.random() * digits.length)])
    .join("");
}

export const AdicionarCartão = (id: number, nomeTitular: string, numeroCartao: string, validade: Date, marca: string, cvc: string, saldo: number, limite:number) => {
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

            return new Cartao_Credito (
            id, 
            nomeTitular, 
            numeroCartao, 
            validade, 
            marca, 
            cvc, 
            saldo, 
            limite
        )

    }

export const AdicionarCartaoDebito = (id: number, nomeTitular: string, numeroCartao: string, validade: Date, marca: string, cvc: string, saldo: number) => {
    const onlyLetters = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if(!nomeTitular || !numeroCartao || !validade || !marca || !cvc || !saldo){
        throw new Error("os dados devem existir");
    }
    if(!onlyLetters.test(nomeTitular)){
        throw new Error("Nome deve conter apenas letras");
    }
    if(numeroCartao.length !== 16){
        throw new Error("O cartão deve conter 16 números");
    }
    if(validade < new Date()){
        throw new Error("Cartão vencido");
    }
    if(cvc.length !== 3){
        throw new Error("CVC deve ter 3 dígitos");
    }
    if(saldo <= 0){
        throw new Error("Saldo não pode ser negativo");
    }

    return new Cartao_Debito(id, nomeTitular, numeroCartao, validade, marca, cvc, saldo);
}


export const gerarBoleto = (id: number, tempoValidade: number, vencimento: number, codigoBarras: string, statusBoleto: object) => {
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
        else{
            values = Object.keys("pago");
        }
    }
    return new Boleto(id, tempoValidade, vencimento, codigoBarras, statusBoleto);
}

export function metodoPagamento(escolha: Pagamentos, valorProduto: number): number {
    if(escolha === Pagamentos.Credito){
        return valorProduto * 0.8;
    }
    else if(escolha === Pagamentos.Pix || escolha === Pagamentos.Boleto){
        return valorProduto * 0.85;
    }
    else{
        return valorProduto
    }
}