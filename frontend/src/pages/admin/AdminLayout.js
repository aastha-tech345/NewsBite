import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>NewsBite<span style={styles.adminBadge}>Admin</span></div>
        <nav style={styles.nav}>
          {[
            { to: '/admin/agents', label: '📡 Feed Agents' },
            { to: '/admin/ads', label: '📢 Ads' },
            { to: '/admin/analytics', label: '📊 Analytics' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </aside>
      <main style={styles.main}>{children}</main>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: 220, background: '#1a1a2e', display: 'flex', flexDirection: 'column', padding: '24px 0' },
  brand: { color: '#fff', fontWeight: 700, fontSize: 18, padding: '0 20px 24px', borderBottom: '1px solid #2a2a4e' },
  adminBadge: { marginLeft: 6, fontSize: 10, background: '#e94560', color: '#fff', padding: '2px 6px', borderRadius: 4, verticalAlign: 'middle' },
  nav: { display: 'flex', flexDirection: 'column', padding: '16px 0', flex: 1 },
  link: { color: '#aaa', textDecoration: 'none', padding: '10px 20px', fontSize: 14, transition: 'all 0.15s' },
  activeLink: { color: '#fff', background: '#2a2a4e', borderLeft: '3px solid #e94560' },
  logoutBtn: { margin: '0 20px', padding: '8px', background: 'none', border: '1px solid #444', color: '#aaa', borderRadius: 4, cursor: 'pointer', fontSize: 13 },
  main: { flex: 1, background: '#f4f6fb', padding: 32, overflowY: 'auto' },
};

export default AdminLayout;
