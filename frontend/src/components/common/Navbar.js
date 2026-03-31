import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/feed" style={styles.brand}>NewsBite</Link>
      {user && (
        <div style={styles.links}>
          <Link to="/feed" style={styles.link}>Feed</Link>
          <Link to="/saved" style={styles.link}>Saved</Link>
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1a1a2e', color: '#fff' },
  brand: { color: '#e94560', fontWeight: 700, fontSize: 20, textDecoration: 'none' },
  links: { display: 'flex', gap: 16, alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none', fontSize: 14 },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 14 },
};

export default Navbar;
