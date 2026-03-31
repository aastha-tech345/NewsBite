import React, { useState } from 'react';

const AuthForm = ({ mode, onSubmit, loading, error }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form} noValidate>
      {mode === 'register' && (
        <input name="name" placeholder="Full Name" value={form.name}
          onChange={handleChange} style={styles.input} required />
      )}
      <input name="email" type="email" placeholder="Email" value={form.email}
        onChange={handleChange} style={styles.input} required />
      <input name="password" type="password" placeholder="Password" value={form.password}
        onChange={handleChange} style={styles.input} required />
      {error && <p style={styles.error}>{error}</p>}
      <button type="submit" style={styles.btn} disabled={loading}>
        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
      </button>
    </form>
  );
};

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '10px 14px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14, outline: 'none' },
  btn: { padding: '11px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, cursor: 'pointer', fontWeight: 600 },
  error: { color: '#e94560', fontSize: 13, margin: 0 },
};

export default AuthForm;
