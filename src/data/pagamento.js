//pix, boleto, crédito, débito..., por hora
//definir caracteristicas e metodos de pagamento num geral
//depois cria classes únicas e suas especificações, pix com chave aleatória, cartão com cvc e etc

export class Pagamento {
    constructor(id, metodo){
        this.id = id;
        this.metodo = metodo;

    }
}