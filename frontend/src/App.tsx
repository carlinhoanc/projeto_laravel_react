import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/UsersList';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import DashboardResumes from './pages/DashboardResumes';
import ResumeEditor from './pages/ResumeEditor';
import { getCurrentUser, removeAuthToken, getAuthToken } from './auth';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App mounted, checking auth...');
    (async () => {
      try {
        const token = getAuthToken();
        console.log('Token in localStorage:', !!token);
        
        if (!token) {
          console.log('No token, user will need to login');
          setLoading(false);
          return;
        }

        const res = await getCurrentUser();
        console.log('getCurrentUser result:', res);
        if (res?.user) {
          setUser(res.user);
        } else {
          console.log('No user returned, clearing token');
          removeAuthToken();
        }
      } catch (e) {
        console.error('Error checking auth:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const handleLogout = async () => {
    const { logout } = await import('./auth');
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    removeAuthToken();
    setUser(null);
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={(u: any) => setUser(u)} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register onRegister={(u: any) => setUser(u)} />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} />
        <Route path="/resumes" element={user ? <DashboardResumes user={user} /> : <Navigate to="/login" replace />} />
        <Route path="/resumes/new" element={user ? <ResumeEditor /> : <Navigate to="/login" replace />} />
        <Route path="/resumes/:id" element={user ? <ResumeEditor /> : <Navigate to="/login" replace />} />
        <Route path="/users" element={user ? <UsersList /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
}
