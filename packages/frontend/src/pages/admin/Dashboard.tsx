import { useEffect, useState } from 'react';
import { get } from '../../api/client';
import type { User } from '../../contexts/AuthContext';

type UserListResponse = User[] | { users: User[] };

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const response = await get<UserListResponse>('/api/admin/users');
        setUsers(Array.isArray(response) ? response : response.users);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load users.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <section>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem', marginTop: 0 }}>Admin Dashboard</h1>
        <p style={{ color: '#475569', margin: 0 }}>Review the current user list from the admin API.</p>
      </div>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden' }}>
        {isLoading ? <p style={{ margin: 0, padding: '1rem 1.25rem' }}>Loading users...</p> : null}
        {error ? <p style={{ color: '#dc2626', margin: 0, padding: '1rem 1.25rem' }}>{error}</p> : null}
        {!isLoading && !error ? (
          users.length ? (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Email</th>
                  <th style={{ padding: '0.9rem 1.25rem' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id ?? user.email} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.9rem 1.25rem' }}>{user.email}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>{user.role ?? 'user'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ margin: 0, padding: '1rem 1.25rem' }}>No users found.</p>
          )
        ) : null}
      </div>
    </section>
  );
}
