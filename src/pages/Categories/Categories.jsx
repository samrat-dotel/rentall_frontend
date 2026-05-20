import { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import { categories } from '../../data/categories';
import { items } from '../../data/items';
import './Categories.css';

export default function Categories() {
  const [selected, setSelected] = useState(null);

  const filtered = selected
    ? items.filter((i) => i.category === selected)
    : [];

  const selectedCat = categories.find((c) => c._id === selected);

  return (
    <div className="categories-page">
      <div className="container">
        <div className="categories-page__header">
          <h1 className="categories-page__title">Categories</h1>
          <p className="categories-page__sub">Browse our full collection by style, occasion, and more.</p>
        </div>

        <div className="categories-page__grid">
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`categories-page__cat-btn${selected === cat._id ? ' categories-page__cat-btn--active' : ''}`}
              onClick={() => setSelected((s) => (s === cat._id ? null : cat._id))}
            >
              <CategoryCard category={cat} />
            </button>
          ))}
        </div>

        {selected && (
          <section className="categories-page__items">
            <div className="categories-page__items-header">
              <h2 className="categories-page__items-title">{selectedCat?.name}</h2>
              <Link to={`/items?category=${selected}`} className="categories-page__view-all">
                View all {filtered.length} items →
              </Link>
            </div>
            {filtered.length === 0 ? (
              <p className="categories-page__empty">No items in this category.</p>
            ) : (
              <div className="categories-page__items-grid">
                {filtered.slice(0, 4).map((item) => (
                  <Link key={item._id} to={`/items/${item._id}`} className="categories-page__item-preview">
                    <div className="categories-page__item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <p className="categories-page__item-name">{item.name}</p>
                    <p className="categories-page__item-price">${item.price}/day</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
