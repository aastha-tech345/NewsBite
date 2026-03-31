import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAds, createAd, updateAd, deleteAd } from '../../services/adminService';

const EMPTY = { title: '', imageUrl: '', targetLink: '', category: 'general', isActive: true };

const AdManager = () => {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try { const { data } = await getAds(); setAds(data.ads); }
    catch { setError('Failed to load ads'); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      editId ? await updateAd(editId, form) : await createAd(form);
      setForm(EMPTY); setEditId(null); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving ad');
    } finally { setLoading(false); }
  };

  const handleEdit = (ad) => {
    setEditId(ad._id);
    setForm({ title: ad.title, imageUrl: ad.imageUrl, targetLink: ad.targetLink, category: ad.category, isActive: ad.isActive });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ad?')) return;
    await deleteAd(id); load();
  };

  return (
    <AdminLayout>
      <h2 style={styles.heading}>Ad Campaigns</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="Ad Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={styles.input} required />
        <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} style={styles.input} required />
        <input placeholder="Target Link (URL)" value={form.targetLink} onChange={(e) => setForm({ ...form, targetLink: e.target.value })} style={styles.input} required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={styles.input}>
          {['general', 'technology', 'business', 'sports', 'health', 'science', 'entertainment', 'world', 'finance'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label style={styles.checkLabel}>
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          &nbsp;Active
        </label>
        {error && <p style={styles.error}>{error}</p>}
        <div style={{ display: 'flex', gap: 8, gridColumn: '1/-1' }}>
          <button type="submit" style={styles.btn} disabled={loading}>{editId ? 'Update Ad' : 'Create Ad'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY); }} style={styles.cancelBtn}>Cancel</button>}
        </div>
      </form>

      <div style={styles.grid}>
        {ads.map((ad) => (
          <div key={ad._id} style={styles.card}>
            {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} style={styles.img} />}
            <div style={styles.cardBody}>
              <div style={styles.cardTitle}>{ad.title}</div>
              <div style={styles.cardMeta}>{ad.category} &bull; <span style={{ color: ad.isActive ? '#28a745' : '#dc3545' }}>{ad.isActive ? 'Active' : 'Inactive'}</span></div>
              <div style={styles.cardActions}>
                <button onClick={() => handleEdit(ad)} style={styles.actionBtn}>Edit</button>
                <button onClick={() => handleDelete(ad._id)} style={{ ...styles.actionBtn, color: '#e94560' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

const styles = {
  heading: { margin: '0 0 20px', color: '#1a1a2e' },
  form: { background: '#fff', padding: 20, borderRadius: 8, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  input: { padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 },
  checkLabel: { fontSize: 13, display: 'flex', alignItems: 'center', gridColumn: '1/-1' },
  btn: { padding: '9px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  cancelBtn: { padding: '9px 20px', background: '#eee', color: '#333', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  error: { color: '#e94560', fontSize: 12, gridColumn: '1/-1', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 },
  card: { background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  img: { width: '100%', height: 130, objectFit: 'cover' },
  cardBody: { padding: 12 },
  cardTitle: { fontWeight: 600, fontSize: 14, color: '#1a1a2e', marginBottom: 4 },
  cardMeta: { fontSize: 12, color: '#888', marginBottom: 8 },
  cardActions: { display: 'flex', gap: 8 },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#555', padding: '3px 6px' },
};

export default AdManager;
