import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '0.5rem',
  marginBottom: '0.75rem'
};

const actionStyle = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap'
};

function EntryCard({ entry, onDelete }) {
  const formatted = dayjs(entry.createdAt).format('MMM D, YYYY');

  return (
    <article className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={cardHeaderStyle}>
        <div>
          <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem' }}>
            {entry.date} · {formatted}
          </p>
          <h3 style={{ margin: '0.2rem 0 0' }}>{entry.title || 'Untitled entry'}</h3>
        </div>
      </div>
      <p style={{ margin: 0, color: 'var(--color-muted)' }}>
        {entry.content.slice(0, 160)}
        {entry.content.length > 160 ? '…' : ''}
      </p>
      <div style={actionStyle}>
        <Link className="btn btn-ghost" to={`/entries/${entry.id}`}>
          View
        </Link>
        <Link className="btn btn-ghost" to={`/entries/${entry.id}/edit`}>
          Edit
        </Link>
        <button className="btn btn-ghost" type="button" onClick={() => onDelete(entry.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default EntryCard;

