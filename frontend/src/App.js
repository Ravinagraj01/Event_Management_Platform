import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPortal from './components/AdminPortal';
import StudentApp from './components/StudentApp';
import LandingPage from './components/LandingPage';
import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/*" element={
                <ProtectedRoute requiredType="admin">
                  <AdminPortal />
                </ProtectedRoute>
              } />
              <Route path="/student/*" element={
                <ProtectedRoute requiredType="student">
                  <StudentApp />
                </ProtectedRoute>
              } />
            </Routes>
          </motion.div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
