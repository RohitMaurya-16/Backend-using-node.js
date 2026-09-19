import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';
import AuthorDashboardPage from './pages/AuthorDashboardPage';
import { api } from './services/api';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((response) => {
        const nextUser = response.user;
        localStorage.setItem('user', JSON.stringify(nextUser));
        setUser(nextUser);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: Boolean(user),
    }),
    [user]
  );

  if (loading) {
    return <div className="app-shell">Loading...</div>;
  }

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} />} />
        <Route path="/posts" element={<PostsPage user={user} />} />
        <Route path="/posts/:id" element={<PostDetailPage user={user} setUser={setUser} />} />
        <Route path="/dashboard" element={<AuthorDashboardPage user={user} setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;
