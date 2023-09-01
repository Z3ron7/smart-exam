import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import LayoutStudents from './components/LayoutStudents';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Admin/Dashboard';
import Questionnaire from './pages/Admin/Questionnaire';
import Room from './pages/Admin/Room';
import Users from './pages/users/Users';
import LoginPage from './pages/Login/LoginPage';
import Register from './pages/Login/Register';
import PageNotFound from './pages/PageNotFound';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token !== null);
  }, []);

  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/Log-in" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />

        {isLoggedIn ? (
          <>
            <Route path='/dashboard' element={<Layout><Dashboard /></Layout>} />
            <Route path='/users' element={<Layout><Users /></Layout>} />
            <Route path='/room' element={<Layout><Room /></Layout>} />
            <Route path='/questionnaire' element={<Layout><Questionnaire /></Layout>} />
          </>
        ) : (
          <>
            <Route path='/dashboard' element={<Navigate to="/" replace />} />
            <Route path='/users' element={<Navigate to="/" replace />} />
            <Route path='/room' element={<Navigate to="/" replace />} />
            <Route path='/questionnaire' element={<Navigate to="/" replace />} />
          </>
        )}

        <Route path='/*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
