const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'var(--color-muted)',
  padding: '2rem'
};

const circleStyle = {
  width: '36px',
  height: '36px',
  border: '4px solid var(--color-border)',
  borderTopColor: 'var(--color-primary)',
  borderRadius: '50%',
  animation: 'spinner-rotate 1s linear infinite'
};

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <>
      <div style={containerStyle}>
        <div style={circleStyle} />
        <p>{label}</p>
      </div>
      <style>
        {`
          @keyframes spinner-rotate {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
}

export default LoadingSpinner;

