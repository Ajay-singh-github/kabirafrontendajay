
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landingpage from './screen/Landingpage';  
import PlpPage from './screen/Plppage';
import Pdp from './screen/Pdp';
import Cart from './screen/cart'; 
import { AuthProvider } from './context/AuthContext'; 
import  Loader  from '../src/components/Loader';
import Shop from './screen/shop';

const App = () => {
  return (
    <AuthProvider> 
      <Router>
        <Routes>
          
          <Route path="/" element={<Landingpage />} />  
          <Route path="/plp/:category" element={<PlpPage />} />
          <Route path="/product/:id" element={<Pdp />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/loader" element={<Loader/>} />
          <Route path="/shop" element={<Shop/>} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
