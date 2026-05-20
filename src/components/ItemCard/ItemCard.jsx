import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import './ItemCard.css';

export default function ItemCard({ item }) {
  const { isWishlisted, toggle } = useWishlist();
  const { addToast } = useToast();
  const wishlisted = isWishlisted(item._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(item._id);
    addToast(
      wishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      wishlisted ? 'info' : 'success'
    );
  };

  return (
    <Link to={`/items/${item._id}`} className="item-card">
      <div className="item-card__image-wrap">
        <img src={item.image} alt={item.name} className="item-card__image" loading="lazy" />
        {item.featured && <span className="item-card__featured">Featured</span>}
        <button
          className={`item-card__wishlist${wishlisted ? ' item-card__wishlist--active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        {item.stock === 0 && <div className="item-card__sold-out">Rented</div>}
      </div>
      <div className="item-card__body">
        <p className="item-card__name">{item.name}</p>
        <div className="item-card__footer">
          <span className="item-card__price">
            <span className="item-card__price-label">from </span>
            ${item.price}
            <span className="item-card__price-unit">/day</span>
          </span>
          <span className={`item-card__stock${item.stock <= 1 ? ' item-card__stock--low' : ''}`}>
            {item.stock > 0 ? `${item.stock} left` : 'Unavailable'}
          </span>
        </div>
      </div>
    </Link>
  );
}
