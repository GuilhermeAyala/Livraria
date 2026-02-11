import { total } from ""

export class Credito extends Pagamento {
    constructor(){
        super(id);
        this.nomeTitular = this.nomeTitular;
        this.numeroCartao = this.numeroCartao;
        this.validade = this.validade;
        this.marca = this.marca;
        this.cvc = this.cvc;
        this.saldo = saldo;
    }

}

    const AdicionarCartão = () => {}
    const ValidarCartao = () => {}
    const VerificarSaldo = () => {
        if(this.saldo < 0){
            console.log("Saldo insuficiente");
        }
        else{
            this.saldo - total; //total vem do carrinho/books
            return new this.saldo;
        }
    }