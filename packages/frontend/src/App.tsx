import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
