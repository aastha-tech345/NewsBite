import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePreferences } from '../services/feedService';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'business', label: 'Business', emoji: '📈' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'health', label: 'Health', emoji: '🏥' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { id: 'world', label: 'World News', emoji: '🌍' },
  { id: 'finance', label: 'Finance', emoji: '💰' },
];

const Onboarding = () => {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await updatePreferences(selected);
      setUser({ ...user, preferences: selected });
      navigate('/feed');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>What are you interested in?</h2>
        <p style={styles.sub}>Pick at least one category to personalize your feed.</p>
        <div style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              style={{
                ...styles.chip,
                ...(selected.includes(cat.id) ? styles.chipActive : {}),
              }}
            >
              <span style={styles.emoji}>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0 || loading}
          style={{ ...styles.btn, opacity: selected.length === 0 ? 0.5 : 1 }}
        >
          {loading ? 'Saving...' : `Continue with ${selected.length} topic${selected.length !== 1 ? 's' : ''}`}
        </button>
        <button onClick={() => navigate('/feed')} style={styles.skip}>Skip for now</button>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb', padding: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 32, maxWidth: 520, width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  title: { color: '#1a1a2e', margin: '0 0 8px', fontSize: 22 },
  sub: { color: '#888', fontSize: 14, marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 },
  chip: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 8, border: '2px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'all 0.15s' },
  chipActive: { border: '2px solid #e94560', background: '#fff0f3', color: '#e94560' },
  emoji: { fontSize: 18 },
  btn: { width: '100%', padding: 13, background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  skip: { display: 'block', width: '100%', marginTop: 10, background: 'none', border: 'none', color: '#999', fontSize: 13, cursor: 'pointer', textAlign: 'center' },
};

export default Onboarding;
