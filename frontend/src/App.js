import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Login from './Components/login.component';
import Signup from './Components/signup.component';

const App = () => {
    return (
        <BrowserRouter>
            <div>                
                <Routes>                       
                    <Route path='/' element={<Login />} />
                    <Route path='/dashboard' exact element={<Dashboard />} />
                    <Route path='/signup' element={<Signup />} />
                </Routes>                    
            </div>
        </BrowserRouter>
    );
}

export default App;