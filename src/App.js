import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './components/pages/SignInPage/SignInPage.js';
import SignUpPage from './components/pages/SignUpPage/SignUpPage.js';
import HomePage from './components/pages/HomePage/HomePage.js';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/homepage" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
