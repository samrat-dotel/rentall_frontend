import { Link } from 'react-router-dom';
import './CategoryCard.css';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/items?category=${category._id}`}
      className="category-card"
      aria-label={category.name}
    >
      <div className="category-card__image-wrap">
        <img src={category.image} alt={category.name} className="category-card__image" loading="lazy" />
        <div className="category-card__overlay" />
      </div>
      <div className="category-card__label">
        <span>{category.name}</span>
      </div>
    </Link>
  );
}
