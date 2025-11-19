import { useTheme } from '../contexts/ThemeContext.jsx';

const buttonStyle = {
  border: '1px solid var(--color-border)',
  borderRadius: '999px',
  background: 'var(--color-surface)',
  padding: '0.4rem 0.9rem',
  color: 'var(--color-text)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  transition: 'transform 0.2s ease'
};

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const icon = theme === 'light' ? '🌙' : '☀️';

  return (
    <button
      style={buttonStyle}
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      onMouseDown={(event) => event.preventDefault()}
    >
      <span>{icon}</span>
      <span style={{ fontSize: '0.85rem' }}>{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );
}

export default ThemeToggle;

