import React from 'react';
import ListaBooks from './components/ListaBooks';
import ShowCarrinho from './components/Carrinho';

function App() {
  return (
    <div>
      <h1>Livraria</h1>
      <ListaBooks/>

      <h1>Carrinho</h1>
      <ShowCarrinho/>
      
    </div>

  );
}

export default App;
