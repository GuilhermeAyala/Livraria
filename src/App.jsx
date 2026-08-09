import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartoesProvider } from './contexts/CartoesContext';
import { CarrinhoProvider } from './contexts/CarrinhoContext';
import { FavoritosProvider } from './contexts/FavoritosContext';
import { PedidoProvider } from './contexts/PedidoContext';
import { LivrosProvider } from './contexts/LivrosContext';
import EntradaForm from './components/EntradaForm';
import CadastroForm from './components/CadastroForm';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import Favoritos from './components/Favoritos';
import Profile from './components/Profile';
import Pagamento from './components/Pagamento';
import CarrinhoView from './components/Carrinho';

function App() {
  return(
    <BrowserRouter>
    <CarrinhoProvider>
    <FavoritosProvider>
    <CartoesProvider>
    <PedidoProvider>
    <LivrosProvider>
      <Routes>
        <Route path='/' element={<EntradaForm />} />
        <Route path='/cadastro' element={<CadastroForm />} />
        <Route path='/user' element={<UserPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/user/Carrinho' element={<CarrinhoView />} />
        <Route path='/user/Favoritos' element={<Favoritos />} />
        <Route path='/user/Profile' element={<Profile />} />
        <Route path='/user/Pagamento' element={<Pagamento />}/>
      </Routes>
    </LivrosProvider>
    </PedidoProvider>
    </CartoesProvider>
    </FavoritosProvider>
    </CarrinhoProvider>
    </BrowserRouter>
  );
  
}

export default App;
