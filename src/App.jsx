import React, { useState } from 'react';
import ListaBooks from './components/ListaBooks';
import CarrinhoView from './components/Carrinho';
import FormUser from './components/FormUser';

function App() {
  const [usuario, setUsuario] = useState(null);

  function handleFormSubmit(data){
      console.log(data);
      setUsuario(data)
  }

  return (
    <div>
      <h1>Livraria</h1>

      <FormUser onSubmit={handleFormSubmit}/>
      {usuario &&(
        <pre style={{background: '#eee', padding: 8}}>
          {JSON.stringify(usuario, null, 2)}
        </pre>
      )}


      <h2>Lista de Livros</h2>
      <ListaBooks/>

      <h1>Carrinho</h1>
      <CarrinhoView/>

    </div>

  );
}

export default App;
