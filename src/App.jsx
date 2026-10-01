import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartoesProvider } from './contexts/CartoesContext';
import { CarrinhoProvider } from './contexts/CarrinhoContext';
import { FavoritosProvider } from './contexts/FavoritosContext';
import { PedidoProvider } from './contexts/PedidoContext';
import { AuthProvider } from './contexts/AuthContext';
import { LivrosProvider } from './contexts/LivrosContext';
import EntradaForm from './components/EntradaForm';
import CadastroForm from './components/CadastroForm';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import Favoritos from './components/Favoritos';
import Profile from './components/Profile';
import Pagamento from './components/Pagamento';
import CarrinhoView from './components/Carrinho';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return(
    <BrowserRouter>
    <AuthProvider>
    <CarrinhoProvider>
    <FavoritosProvider>
    <CartoesProvider>
    <PedidoProvider>
    <LivrosProvider>
      <Routes>
        <Route path='/' element={<EntradaForm />} />
        <Route path='/cadastro' element={<CadastroForm />} />
        <Route path='/user' element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
        <Route path='/admin' element={<ProtectedRoute role="ADMIN"><AdminPage /></ProtectedRoute>} />
        <Route path='/user/Carrinho' element={<ProtectedRoute><CarrinhoView /></ProtectedRoute>} />
        <Route path='/user/Favoritos' element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
        <Route path='/user/Profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/user/Pagamento' element={<ProtectedRoute><Pagamento /></ProtectedRoute>}/>
      </Routes>
    </LivrosProvider>
    </PedidoProvider>
    </CartoesProvider>
    </FavoritosProvider>
    </CarrinhoProvider>
    </AuthProvider>
    </BrowserRouter>
  );
  
}

export default App;
