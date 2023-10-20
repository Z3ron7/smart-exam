import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LayoutSuper from './components/LayoutSuper';
import Layout from './components/Layout';
import LayoutStudents from './components/LayoutStudents';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Admin/Dashboard';
import Questionnaire from './pages/Admin/Questionnaire';
import Room from './pages/Admin/Room';
import RoomSuper from './pages/SuperAdmin/Room';
import Users from './pages/users/Users';
import User from './pages/user/User';
import LoginPage from './pages/Login/LoginPage';
import Verification from './pages/Login/Verification';
import Register from './pages/Login/Register';
import PageNotFound from './pages/PageNotFound';
import StudentDashboard from './pages/Students/StudentDashboard';
import Exam from './pages/Students/Exam'
import ExamHistory from './pages/Students/ExamHistory'
import ProtectedRoute from './pages/ProtectedRoute';
import AddQuestion from './pages/Admin/AddQuestion'

import DashboardSuper from './pages/SuperAdmin/Dashboard'
import QuestionnaireSuper from './pages/SuperAdmin/Questionnaire'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(token !== null);
    setUserRole(role);

    const verificationStatus = localStorage.getItem('isVerified');
    setIsVerified(verificationStatus === 'true'); 
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PageNotFound />} />

        <Route path="/register" element={<Register />} />
        <Route path="/Log-in" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/verification" element={<Verification />} />


        {/* Routes for super admin */}
        <Route
          path="/super-dashboard"
          element={
            <ProtectedRoute
              element={<LayoutSuper><DashboardSuper /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute
              element={<LayoutSuper><Users /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute
              element={<LayoutSuper><User /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/questionnaire"
          element={
            <ProtectedRoute
              element={<LayoutSuper><QuestionnaireSuper /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/room"
          element={
            <ProtectedRoute
              element={<LayoutSuper><RoomSuper /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
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
      element={
        isLoggedIn && isVerified ? (
          <LayoutStudents>
            <StudentDashboard />
          </LayoutStudents>
        ) : (
          <Verification />
        )
      }
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
              element={<LayoutStudents><ExamHistory /></LayoutStudents>}
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
