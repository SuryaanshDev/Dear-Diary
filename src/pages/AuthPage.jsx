import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { authSchema, validate } from '../utils/validators.js';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem'
};

const cardStyle = {
  width: '100%',
  maxWidth: '420px',
  padding: '2rem'
};

function AuthPage() {
  const { login, register, authLoading, authError, isAuthenticated, setAuthError } = useAuth();
  const [mode, setMode] = useState('login');
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const subtitle = useMemo(
    () =>
      mode === 'login'
        ? 'Welcome back. Sign in to continue your diary.'
        : 'Create an account to start journaling.',
    [mode]
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setAuthError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data, errors: validation } = await validate(authSchema, values);
    if (validation) {
      setErrors(validation);
      return;
    }
    setErrors({});

    try {
      if (mode === 'login') {
        await login(data);
      } else {
        await register(data);
      }
    } catch (error) {
      // handled via context state
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setErrors({});
    setAuthError(null);
  };

  return (
    <div style={containerStyle}>
      <div className="card" style={cardStyle}>
        <h1 style={{ marginTop: 0 }}>Dear Diary</h1>
        <p style={{ color: 'var(--color-muted)' }}>{subtitle}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              value={values.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email ? <p className="error-text">{errors.email}</p> : null}
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              value={values.password}
              onChange={handleChange}
              placeholder="••••••"
            />
            {errors.password ? <p className="error-text">{errors.password}</p> : null}
          </div>

          {authError ? <p className="error-text">{authError}</p> : null}

          <button className="btn btn-primary" type="submit" disabled={authLoading}>
            {authLoading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              padding: 0,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;

