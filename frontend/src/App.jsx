
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect } from "react";
import LoginForm from './components/LoginForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import { useSelector } from 'react-redux';
import RegisterForm from "./components/RegisterForm.jsx";
import './assets/styles/global.css';


const App = () => {

    const { loading, error } = useSelector((state) => state.aircrafts);


  useEffect(() => {
    if (error) {
      token=false;
    } 
  }, [token]);

    const { token } = useSelector((state) => state.auth);
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"}/>}/>
                <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginForm />} />
                <Route path="/register" element={token ? <Navigate to="/dashboard"/> :<RegisterForm/>} />
                <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

