import EntryCard from './EntryCard.jsx';
import EmptyState from './EmptyState.jsx';

const gridStyle = {
  display: 'grid',
  gap: '1rem'
};

function EntryList({ entries, onDelete }) {
  if (!entries.length) {
    return (
      <EmptyState
        title="No entries yet"
        message="Start writing your first diary entry to see it appear here."
        actionLabel="Write now"
        actionHref="/entries/new"
      />
    );
  }

  return (
    <section style={gridStyle}>
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} onDelete={onDelete} />
      ))}
    </section>
  );
}

export default EntryList;

