import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EntryForm from '../components/EntryForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { entryApi } from '../utils/api.js';

function EntryEditor({ mode }) {
  const { id } = useParams();
  const isEdit = mode === 'edit';
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEntry() {
      if (!isEdit) return;
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
  }, [id, isEdit]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (isEdit) {
        await entryApi.update(id, values);
      } else {
        await entryApi.create(values);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save entry');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading entry..." />;
  }

  return (
    <section className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem' }}>
            {isEdit ? 'Edit entry' : 'New entry'}
          </p>
          <h2 style={{ margin: '0.2rem 0 0' }}>
            {entry?.title || (isEdit ? 'Update your thoughts' : 'What’s on your mind?')}
          </h2>
        </div>
        <Link className="btn btn-ghost" to="/">
          Back
        </Link>
      </div>

      <EntryForm initialValues={entry} pending={saving} onSubmit={handleSubmit} serverError={error} />
    </section>
  );
}

export default EntryEditor;

