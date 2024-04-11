import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LogIn';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import LastTransactionPage from './pages/LastTransaction';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage/>}/>
        <Route exact path="/home" element={<HomePage/>}/>
        <Route exact path="/transaction" element={<LastTransactionPage/>}/>
        <Route exact path="/*" element={<NotFoundPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;