import { Link } from 'react-router-dom';

function EmptyState({ title, message, actionLabel, actionHref }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ color: 'var(--color-muted)' }}>{message}</p>
      {actionLabel && actionHref ? (
        <Link className="btn btn-primary" to={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export default EmptyState;

