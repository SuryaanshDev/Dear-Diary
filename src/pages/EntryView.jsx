import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { entryApi } from '../utils/api.js';

function EntryView() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEntry() {
      try {
        const { data } = await entryApi.getById(id);
        setEntry(data.entry);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load entry');
      } finally {
        setLoading(false);
      }
    }
    loadEntry();
  }, [id]);

  const handleDelete = async () => {
    const shouldDelete = window.confirm('Delete this entry?');
    if (!shouldDelete) return;
    try {
      await entryApi.remove(id);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete entry');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading entry..." />;
  }

  if (error) {
    return (
      <section className="card">
        <p className="error-text">{error}</p>
        <Link className="btn btn-ghost" to="/">
          Back to dashboard
        </Link>
      </section>
    );
  }

  return (
    <article className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--color-muted)' }}>
            {entry.date} · Updated {dayjs(entry.updatedAt).format('DD MMM YYYY HH:mm')}
          </p>
          <h2 style={{ margin: '0.2rem 0 0' }}>{entry.title || 'Untitled entry'}</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link className="btn btn-ghost" to={`/entries/${id}/edit`}>
            Edit
          </Link>
          <button className="btn btn-ghost" type="button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <p style={{ whiteSpace: 'pre-line', marginTop: '1.25rem', fontSize: '1.05rem' }}>{entry.content}</p>
      <Link className="btn btn-primary" to="/">
        Back to dashboard
      </Link>
    </article>
  );
}

export default EntryView;

