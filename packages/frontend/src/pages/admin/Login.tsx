import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const destination = location.state?.from?.pathname ?? '/admin';

  if (isAuthenticated) {
    return <Navigate replace to="/admin" />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to sign in.');
    }
  };

  return (
    <section
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '1rem',
        margin: '0 auto',
        maxWidth: '420px',
        padding: '2rem',
      }}
    >
      <h1 style={{ marginTop: 0 }}>Admin Login</h1>
      <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Sign in to access the admin dashboard.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Email</span>
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{ border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.75rem' }}
            type="email"
            value={email}
          />
        </label>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Password</span>
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{ border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.75rem' }}
            type="password"
            value={password}
          />
        </label>
        {error ? <p style={{ color: '#dc2626', margin: 0 }}>{error}</p> : null}
        <button
          disabled={isLoading}
          style={{
            background: '#2563eb',
            border: 0,
            borderRadius: '0.5rem',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '0.85rem 1rem',
          }}
          type="submit"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
