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
import StudentDashboard from './pages/Students/StudentDashboard';
import Exam from './pages/Students/Exam'
import Result from './pages/Students/Result'
import ProtectedRoute from './pages/ProtectedRoute';
import AddQuestion from './pages/Admin/AddQuestion'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(token !== null);
    setUserRole(role);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PageNotFound />} />

        <Route path="/register" element={<Register />} />
        <Route path="/Log-in" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />

        {/* Routes for admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<Layout><Dashboard /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute
              element={<Layout><Users /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/room"
          element={
            <ProtectedRoute
              element={<Layout><Room /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/questionnaire"
          element={
            <ProtectedRoute
              element={<Layout><Questionnaire /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/addQuestion"
          element={
            <ProtectedRoute
              element={<Layout><AddQuestion /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />

        {/* Routes for student */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute
              element={<LayoutStudents><StudentDashboard /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/exam"
          element={
            <ProtectedRoute
              element={<LayoutStudents><Exam /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute
              element={<LayoutStudents><Result /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/student-room"
          element={
            <ProtectedRoute
              element={<LayoutStudents><Room /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/student-questionnaire"
          element={
            <ProtectedRoute
              element={<LayoutStudents><Questionnaire /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />

        <Route path="/" element={<LandingPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
