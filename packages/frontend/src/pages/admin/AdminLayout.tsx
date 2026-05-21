import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '240px 1fr' }}>
      <aside
        style={{
          alignSelf: 'start',
          background: '#0f172a',
          borderRadius: '1rem',
          color: '#ffffff',
          padding: '1.5rem',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Admin</h2>
        <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>{user?.email}</p>
        <nav style={{ display: 'grid', gap: '0.75rem' }}>
          <Link style={{ color: '#ffffff', textDecoration: 'none' }} to="/admin">
            Dashboard
          </Link>
          <Link style={{ color: '#ffffff', textDecoration: 'none' }} to="/">
            Back to Home
          </Link>
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
