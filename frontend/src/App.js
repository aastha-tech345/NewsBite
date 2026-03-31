import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Feed from './pages/Feed';
import Saved from './pages/Saved';
import AgentManager from './pages/admin/AgentManager';
import AdManager from './pages/admin/AdManager';
import Analytics from './pages/admin/Analytics';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User */}
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
        <Route path="/saved" element={<PrivateRoute><Saved /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin/agents" element={<AdminRoute><AgentManager /></AdminRoute>} />
        <Route path="/admin/ads" element={<AdminRoute><AdManager /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
        <Route path="/admin" element={<Navigate to="/admin/agents" replace />} />

        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
