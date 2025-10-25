import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from './components/LoginForm';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';


function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/user' element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
