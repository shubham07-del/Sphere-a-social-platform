import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Main Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Explore from './pages/Explore';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppRoutes = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading...</div>;
  }

  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />} />

        {/* Protected Routes inside MainLayout */}
        <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="explore" element={<Explore />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;