import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { entryApi } from '../utils/api.js';
import EntryList from '../components/EntryList.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

dayjs.extend(relativeTime);

const controlsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  marginBottom: '1.5rem'
};

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const loadEntries = async () => {
    setLoading(true);
    try {
      const { data } = await entryApi.list();
      setEntries(data.entries || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchDate) {
      setDateFilter('');
      return loadEntries();
    }

    try {
      setLoading(true);
      const { data } = await entryApi.byDate(searchDate);
      setEntries(data.entries || []);
      setDateFilter(searchDate);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'No entries for that date');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm('Delete this entry?');
    if (!shouldDelete) return;

    try {
      await entryApi.remove(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete entry');
    }
  };

  const summary = useMemo(() => {
    if (!entries.length) return 'No entries yet';
    const latest = entries[0];
    return `Last updated ${dayjs(latest.updatedAt).fromNow()}`;
  }, [entries]);

  return (
    <div>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, color: 'var(--color-muted)' }}>{summary}</p>

        <form style={controlsStyle} onSubmit={handleSearch}>
          <input
            type="text"
            className="input"
            placeholder="Filter by date (dd/mm/yyyy)"
            value={searchDate}
            onChange={(event) => setSearchDate(event.target.value)}
            style={{ flex: '1 1 240px' }}
          />
          <button className="btn btn-primary" type="submit">
            Filter
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => {
              setSearchDate('');
              setDateFilter('');
              loadEntries();
            }}
          >
            Clear
          </button>
        </form>

        {dateFilter ? (
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>
            Showing entries for <strong>{dateFilter}</strong>
          </p>
        ) : null}
      </section>

      {loading ? (
        <LoadingSpinner label="Loading your entries..." />
      ) : error ? (
        <div className="card">
          <p className="error-text">{error}</p>
        </div>
      ) : (
        <EntryList entries={entries} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default Dashboard;

