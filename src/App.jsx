import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CarrinhoProvider } from './contexts/CarrinhoContext';
import { FavoritosProvider } from './contexts/FavoritosContext';
import LoginForm from './components/LoginForm';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import Favoritos from './components/Favoritos';
import Profile from './components/Profile';
import Pagamento from './components/Pagamento';
import CarrinhoView from './components/Carrinho';

function App() {
  return(
    <BrowserRouter>
    <CarrinhoProvider>
    <FavoritosProvider>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/user' element={<UserPage />} />
        <Route path='/user/Carrinho' element={<CarrinhoView />} />
        <Route path='/user/Favoritos' element={<Favoritos />} />
        <Route path='/user/Profile' element={<Profile />} />
        <Route path='/user/Pagamento' element={<Pagamento />}/>
      </Routes>
    </FavoritosProvider>
    </CarrinhoProvider>
    </BrowserRouter>
  );
  
}

export default App;
