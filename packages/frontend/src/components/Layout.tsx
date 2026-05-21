import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navLinkStyle = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 600,
};

export default function Layout() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <header
        style={{
          alignItems: 'center',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
        }}
      >
        <nav style={{ alignItems: 'center', display: 'flex', gap: '1rem' }}>
          <Link style={navLinkStyle} to="/">
            Home
          </Link>
          {isAuthenticated ? (
            <Link style={navLinkStyle} to="/admin">
              Admin
            </Link>
          ) : null}
        </nav>
        <div style={{ alignItems: 'center', display: 'flex', gap: '0.75rem' }}>
          {user ? <span>Signed in as {user.email}</span> : null}
          {isAuthenticated ? (
            <button
              onClick={logout}
              style={{
                background: '#0f172a',
                border: 0,
                borderRadius: '0.5rem',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '0.65rem 1rem',
              }}
              type="button"
            >
              Logout
            </button>
          ) : (
            <Link style={navLinkStyle} to="/login">
              Login
            </Link>
          )}
        </div>
      </header>
      <main style={{ margin: '0 auto', maxWidth: '1100px', padding: '2rem 1.5rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
