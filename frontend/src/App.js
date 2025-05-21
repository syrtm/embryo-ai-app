import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorAnalysis from './components/DoctorAnalysis';
import PatientDashboard from './components/PatientDashboard';
import PatientProfile from './components/PatientProfile';
import MedicalRecords from './components/MedicalRecords';
import Messages from './components/Messages';
import Appointments from './components/Appointments';
import TreatmentPlan from './components/TreatmentPlan';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import ForgotPassword from './components/ForgotPassword';
import DashboardLayout from './components/DashboardLayout';
import Patients from './components/Patients';
import DoctorProfile from './pages/doctor/DoctorProfile';
import EmbryoReport from './components/EmbryoReport';
import { NotificationProvider } from './context/NotificationContext';

function PatientRoutes({ onLogout }) {
  // Get user name from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.full_name || 'Patient';
  
  return (
    <DashboardLayout userRole="patient" userName={userName} onLogout={onLogout}>
      <Routes>
        <Route path="/" element={<PatientDashboard />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/records" element={<MedicalRecords />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/treatment" element={<TreatmentPlan />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/embryo-report/:id" element={<EmbryoReport />} />
      </Routes>
    </DashboardLayout>
  );
}

function DoctorRoutes({ onLogout }) {
  // Get user name from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.full_name || 'Doctor';
  
  return (
    <DashboardLayout userRole="doctor" userName={userName} onLogout={onLogout}>
      <Routes>
        <Route path="/" element={<DoctorDashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/settings" element={<Settings />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/profile" element={<DoctorProfile />} />
      <Route path="/analysis" element={<DoctorAnalysis />} />
      </Routes>
    </DashboardLayout>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = localStorage.getItem('user');
    return !!user;
  });
  const [userRole, setUserRole] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  });

  const handleLogin = (credentials) => {
      setIsAuthenticated(true);
    setUserRole(credentials.role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('user');
  };

  return (
    <NotificationProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to={userRole === 'doctor' ? '/doctor' : '/patient'} />
              )
            } 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <SignUp /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/forgot-password" 
            element={<ForgotPassword />} 
          />
          
          {/* Protected Patient Routes */}
          <Route
            path="/patient/*"
            element={
              isAuthenticated && userRole === 'patient' ? (
                <PatientRoutes onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Protected Doctor Routes */}
          <Route
            path="/doctor/*"
            element={
              isAuthenticated && userRole === 'doctor' ? (
                <DoctorRoutes onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
