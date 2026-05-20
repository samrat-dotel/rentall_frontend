import { X } from 'lucide-react';
import { categories } from '../../data/categories';
import './FilterSidebar.css';

export default function FilterSidebar({ filters, onChange, onClose, isMobile = false }) {
  const setFilter = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className={`filter-sidebar${isMobile ? ' filter-sidebar--mobile' : ''}`}>
      {isMobile && (
        <div className="filter-sidebar__header">
          <h3>Filters</h3>
          <button onClick={onClose} aria-label="Close filters"><X size={20} /></button>
        </div>
      )}

      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__label">Category</h4>
        <ul className="filter-sidebar__list">
          <li>
            <button
              className={`filter-sidebar__option${!filters.category ? ' filter-sidebar__option--active' : ''}`}
              onClick={() => setFilter('category', '')}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                className={`filter-sidebar__option${filters.category === cat._id ? ' filter-sidebar__option--active' : ''}`}
                onClick={() => setFilter('category', cat._id)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__label">Price Range</h4>
        <div className="filter-sidebar__price">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={filters.minPrice ?? ''}
            onChange={(e) => setFilter('minPrice', e.target.value ? Number(e.target.value) : '')}
            className="filter-sidebar__input"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={filters.maxPrice ?? ''}
            onChange={(e) => setFilter('maxPrice', e.target.value ? Number(e.target.value) : '')}
            className="filter-sidebar__input"
          />
        </div>
      </div>

      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__label">Availability</h4>
        <label className="filter-sidebar__checkbox">
          <input
            type="checkbox"
            checked={!!filters.inStock}
            onChange={(e) => setFilter('inStock', e.target.checked)}
          />
          In stock only
        </label>
        <label className="filter-sidebar__checkbox">
          <input
            type="checkbox"
            checked={!!filters.featured}
            onChange={(e) => setFilter('featured', e.target.checked)}
          />
          Featured
        </label>
      </div>

      <button
        className="filter-sidebar__reset"
        onClick={() => onChange({ category: '', minPrice: '', maxPrice: '', inStock: false, featured: false })}
      >
        Reset Filters
      </button>
    </aside>
  );
}
