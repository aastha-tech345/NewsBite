import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getCampaignStats } from '../../services/adminService';

const Analytics = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaignStats()
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalViews = stats.reduce((s, r) => s + (r.totalViews || 0), 0);
  const totalClicks = stats.reduce((s, r) => s + (r.totalClicks || 0), 0);
  const overallCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

  return (
    <AdminLayout>
      <h2 style={styles.heading}>Campaign Analytics</h2>

      <div style={styles.summaryRow}>
        {[
          { label: 'Total Impressions', value: totalViews },
          { label: 'Total Clicks', value: totalClicks },
          { label: 'Overall CTR', value: `${overallCTR}%` },
        ].map(({ label, value }) => (
          <div key={label} style={styles.summaryCard}>
            <div style={styles.summaryValue}>{value}</div>
            <div style={styles.summaryLabel}>{label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#888' }}>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>{['Ad Title', 'Category', 'Unique Views', 'Unique Clicks', 'CTR'].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {stats.length === 0 && (
              <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#999' }}>No data yet</td></tr>
            )}
            {stats.map((row) => (
              <tr key={row._id} style={styles.tr}>
                <td style={styles.td}>{row.ad?.title || '—'}</td>
                <td style={styles.td}>{row.ad?.category || '—'}</td>
                <td style={styles.td}>{row.totalViews}</td>
                <td style={styles.td}>{row.totalClicks}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.ctrBadge, background: row.ctr > 5 ? '#d4edda' : '#fff3cd', color: row.ctr > 5 ? '#155724' : '#856404' }}>
                    {row.ctr}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

const styles = {
  heading: { margin: '0 0 20px', color: '#1a1a2e' },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 },
  summaryCard: { background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' },
  summaryValue: { fontSize: 28, fontWeight: 700, color: '#e94560' },
  summaryLabel: { fontSize: 13, color: '#888', marginTop: 4 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  th: { background: '#f8f9fa', padding: '10px 14px', textAlign: 'left', fontSize: 12, color: '#666', fontWeight: 600 },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '10px 14px', fontSize: 13 },
  ctrBadge: { padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 },
};

export default Analytics;
