import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

export default function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;

  const pages = [];
  for (let i = 1; i <= total; i++) pages.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`pagination__btn${p === current ? ' pagination__btn--active' : ''}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
