import './Loader.css';

export function Loader({ size = 'md', fullPage = false }) {
  const el = (
    <div className={`loader loader--${size}`}>
      <span className="loader__ring" />
    </div>
  );
  if (fullPage) {
    return <div className="loader__page">{el}</div>;
  }
  return el;
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton--image" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton--line skeleton--w80" />
        <div className="skeleton skeleton--line skeleton--w50" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 5 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
