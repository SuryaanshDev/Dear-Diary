import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../utils/api.js';

const STORAGE_KEY = 'deardiary-auth';

const AuthContext = createContext();

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored ? stored : { user: null, token: null };
  } catch (error) {
    return { user: null, token: null };
  }
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [{ user, token }, setAuthState] = useState(getInitialState);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const persist = useCallback((nextState) => {
    setAuthState(nextState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    if (nextState.token) {
      localStorage.setItem('deardiary-token', nextState.token);
    } else {
      localStorage.removeItem('deardiary-token');
    }
  }, []);

  const handleAuthSuccess = useCallback(
    (payload) => {
      persist({ user: payload.user, token: payload.token });
      setAuthError(null);
      navigate('/', { replace: true });
    },
    [navigate, persist]
  );

  const login = useCallback(
    async (credentials) => {
      setAuthLoading(true);
      try {
        const { data } = await authApi.login(credentials);
        handleAuthSuccess(data);
        return data;
      } catch (error) {
        const message =
          error.response?.data?.message || error.message || 'Unable to login right now';
        setAuthError(message);
        throw new Error(message);
      } finally {
        setAuthLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const register = useCallback(
    async (payload) => {
      setAuthLoading(true);
      try {
        const { data } = await authApi.register(payload);
        handleAuthSuccess(data);
        return data;
      } catch (error) {
        const message =
          error.response?.data?.message || error.message || 'Unable to sign up right now';
        setAuthError(message);
        throw new Error(message);
      } finally {
        setAuthLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(() => {
    persist({ user: null, token: null });
    navigate('/auth', { replace: true });
  }, [navigate, persist]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      authLoading,
      authError,
      login,
      register,
      logout,
      setAuthError
    }),
    [authError, authLoading, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

