import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '1rem 0'
};

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
};

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isEntryPage = location.pathname.includes('/entries');

  return (
    <header style={headerStyle}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Dear Diary</h1>
        {user ? <p style={{ color: 'var(--color-muted)', margin: 0 }}>{user.email}</p> : null}
      </div>

      <div style={actionsStyle}>
        {!isEntryPage && (
          <Link to="/entries/new" className="btn btn-primary">
            New Entry
          </Link>
        )}
        <ThemeToggle />
        <button className="btn btn-ghost" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;

