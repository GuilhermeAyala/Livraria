import React from 'react';
import ListaBooks from './components/ListaBooks';
import CarrinhoView from './components/Carrinho';

function App() {
  return (
    <div>
      <h1>Livraria</h1>
      <ListaBooks/>

      <h1>Carrinho</h1>
      <CarrinhoView/>

    </div>

  );
}

export default App;
