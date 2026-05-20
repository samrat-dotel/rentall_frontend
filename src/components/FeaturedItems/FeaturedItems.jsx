import { Link } from 'react-router-dom';
import ItemCard from '../ItemCard/ItemCard';
import './FeaturedItems.css';

export default function FeaturedItems({ items, title = 'Featured Items', viewMoreLink = '/items' }) {
  return (
    <section className="featured">
      <div className="featured__header">
        <div className="featured__title-wrap">
          <span className="featured__accent-bar" />
          <h2 className="featured__title">{title}</h2>
        </div>
        <Link to={viewMoreLink} className="featured__view-more">View more</Link>
      </div>
      <div className="featured__grid">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
