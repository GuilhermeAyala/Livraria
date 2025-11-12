import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritosProvider } from './components/FavoritosContext';
import LoginForm from './components/LoginForm';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import Favoritos from './components/Favoritos';


function App() {
  return(
    <BrowserRouter>
    <FavoritosProvider>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/user' element={<UserPage />} />
        <Route path='/user/Favoritos' element={<Favoritos />} />
      </Routes>
    </FavoritosProvider>
    </BrowserRouter>
  );
  
}

export default App;
