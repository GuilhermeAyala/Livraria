import React, { createContext, useContext, useState } from "react";
import { Cartao_Credito, Cartao_Debito } from "../models/pagamento";

type CartaoSalvo = {
    tipo: "Credito" | "Debito";
    cartao: Cartao_Credito | Cartao_Debito;
}

type CartoesContextType = {
    cartoes: CartaoSalvo[];
    adicionarCartao: (c: CartaoSalvo) => void;
}

const CartoesContext = createContext<CartoesContextType>({
    cartoes: [],
    adicionarCartao: () => {}
});

export const CartoesProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartoes, setCartoes] = useState<CartaoSalvo[]>([]);

    const adicionarCartao = (c: CartaoSalvo) => {
        setCartoes(prev => [...prev, c]);
    };

    return (
        <CartoesContext.Provider value={{ cartoes, adicionarCartao }}>
            {children}
        </CartoesContext.Provider>
    );
};

export const useCartoes = () => useContext(CartoesContext);