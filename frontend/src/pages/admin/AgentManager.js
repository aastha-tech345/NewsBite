import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAgents, createAgent, updateAgent, deleteAgent, toggleAgent } from '../../services/adminService';

const EMPTY = { name: '', rssUrl: '', category: 'technology', fetchInterval: 30 };

const AgentManager = () => {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await getAgents();
      setAgents(data.agents);
    } catch { setError('Failed to load agents'); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (editId) {
        await updateAgent(editId, form);
      } else {
        await createAgent(form);
      }
      setForm(EMPTY); setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving agent');
    } finally { setLoading(false); }
  };

  const handleEdit = (agent) => {
    setEditId(agent._id);
    setForm({ name: agent.name, rssUrl: agent.rssUrl, category: agent.category, fetchInterval: agent.fetchInterval });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this agent?')) return;
    await deleteAgent(id);
    load();
  };

  const handleToggle = async (id) => {
    await toggleAgent(id);
    load();
  };

  return (
    <AdminLayout>
      <h2 style={styles.heading}>Feed Agents</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="Agent Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={styles.input} required />
        <input placeholder="RSS URL" value={form.rssUrl} onChange={(e) => setForm({ ...form, rssUrl: e.target.value })} style={styles.input} required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={styles.input}>
          {['technology', 'business', 'sports', 'health', 'science', 'entertainment', 'world', 'finance'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input type="number" placeholder="Fetch Interval (min)" value={form.fetchInterval}
          onChange={(e) => setForm({ ...form, fetchInterval: Number(e.target.value) })} style={styles.input} min={5} required />
        {error && <p style={styles.error}>{error}</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={styles.btn} disabled={loading}>{editId ? 'Update' : 'Add Agent'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY); }} style={styles.cancelBtn}>Cancel</button>}
        </div>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>{['Name', 'Category', 'Interval', 'Status', 'Actions'].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a._id} style={styles.tr}>
              <td style={styles.td}><div style={styles.agentName}>{a.name}</div><div style={styles.url}>{a.rssUrl}</div></td>
              <td style={styles.td}>{a.category}</td>
              <td style={styles.td}>{a.fetchInterval}m</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, background: a.isActive ? '#d4edda' : '#f8d7da', color: a.isActive ? '#155724' : '#721c24' }}>
                  {a.isActive ? 'Active' : 'Paused'}
                </span>
              </td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(a)} style={styles.actionBtn}>Edit</button>
                <button onClick={() => handleToggle(a._id)} style={styles.actionBtn}>{a.isActive ? 'Pause' : 'Resume'}</button>
                <button onClick={() => handleDelete(a._id)} style={{ ...styles.actionBtn, color: '#e94560' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

const styles = {
  heading: { margin: '0 0 20px', color: '#1a1a2e' },
  form: { background: '#fff', padding: 20, borderRadius: 8, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  input: { padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 },
  btn: { padding: '9px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  cancelBtn: { padding: '9px 20px', background: '#eee', color: '#333', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  error: { color: '#e94560', fontSize: 12, gridColumn: '1/-1', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  th: { background: '#f8f9fa', padding: '10px 14px', textAlign: 'left', fontSize: 12, color: '#666', fontWeight: 600 },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '10px 14px', fontSize: 13, verticalAlign: 'middle' },
  agentName: { fontWeight: 600, color: '#1a1a2e' },
  url: { fontSize: 11, color: '#999', marginTop: 2, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  badge: { padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#555', marginRight: 6, padding: '3px 6px' },
};

export default AgentManager;
