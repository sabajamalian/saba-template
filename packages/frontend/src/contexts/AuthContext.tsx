import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { get, post } from '../api/client';

const TOKEN_STORAGE_KEY = 'token';

type User = {
  id: string;
  email: string;
  role?: string;
  name?: string;
};

type LoginResponse = {
  token: string;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const currentUser = await get<User>('/api/auth/me');
    setUser(currentUser);
    return currentUser;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    void (async () => {
      try {
        await fetchCurrentUser();
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fetchCurrentUser]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await post<LoginResponse>('/api/auth/login', { email, password });
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      await fetchCurrentUser();
    } catch (error) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login,
    logout,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isLoading,
  }), [isLoading, login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export type { User };
