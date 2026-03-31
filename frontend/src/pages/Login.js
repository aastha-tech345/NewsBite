import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await login({ email, password });
      loginUser(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>NewsBite</h1>
        <p style={styles.sub}>Sign in to your account</p>
        <AuthForm mode="login" onSubmit={handleSubmit} loading={loading} error={error} />
        <p style={styles.switch}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>
        <p style={styles.hint}>Admin? Use your admin credentials to access the dashboard.</p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb' },
  card: { background: '#fff', padding: 36, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: 400 },
  logo: { color: '#e94560', margin: '0 0 4px', fontSize: 28 },
  sub: { color: '#888', marginBottom: 24, fontSize: 14 },
  switch: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' },
  link: { color: '#e94560', textDecoration: 'none', fontWeight: 600 },
  hint: { textAlign: 'center', marginTop: 10, fontSize: 11, color: '#bbb' },
};

export default Login;
