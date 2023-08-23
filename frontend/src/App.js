import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard'
import Login from './components/login.component';
import SignUp from './components/signup.component';

const App = () => {
    return (
        <BrowserRouter>
            <div>                
                <Routes>                       
                    <Route exact path="/" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/dashboard" exact element={<Dashboard/>}/>
                </Routes>                    
            </div>
        </BrowserRouter>
    );
}

export default App;