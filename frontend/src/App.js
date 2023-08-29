import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Login from './components/login.component';
import Signup from './components/signup.component';

function App() {
    return (
        <BrowserRouter>
            <Routes>                       
                <Route path='/' element={<Login />} />
                <Route path='/dashboard' exact element={<Dashboard />} />
                <Route path='/signup' element={<Signup />} />
            </Routes>                    
        </BrowserRouter>
    );
}

export default App;