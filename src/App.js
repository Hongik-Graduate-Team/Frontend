import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './components/pages/SignInPage.js';
import SignUpPage from './components/pages/SignUpPage.js';
import HomePage from './components/pages/HomePage.js';
import InputInfo from './components/pages/InputInfo.js';
import './index.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/inputInfo" element={<InputInfo />} />
            </Routes>
        </Router>
    );
}

export default App;
