import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async ({ name, email, password }) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await register({ name, email, password });
      loginUser(data.token, data.user);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>NewsBite</h1>
        <p style={styles.sub}>Create your account</p>
        <AuthForm mode="register" onSubmit={handleSubmit} loading={loading} error={error} />
        <p style={styles.switch}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
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
};

export default Signup;
