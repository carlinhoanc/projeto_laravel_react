import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/UsersList';
import Profile from './pages/Profile';
import { getCurrentUser, removeAuthToken } from './auth';

export default function App() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    console.log('App mounted');
    (async () => {
      const res = await getCurrentUser();
      console.log('getCurrentUser result:', res);
      if (res) setUser(res.user);
    })();
  }, []);

  const handleLogout = async () => {
    const { logout } = await import('./auth');
    await logout();
    removeAuthToken();
    setUser(null);
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={(u: any) => setUser(u)} />} />
        <Route path="/register" element={<Register onRegister={(u: any) => setUser(u)} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/users" element={user ? <UsersList /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </Layout>
  );
}
