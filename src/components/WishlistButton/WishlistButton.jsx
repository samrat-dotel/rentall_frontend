import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import './WishlistButton.css';

export default function WishlistButton({ itemId, size = 'md' }) {
  const { isWishlisted, toggle } = useWishlist();
  const { addToast } = useToast();
  const active = isWishlisted(itemId);

  const handleClick = () => {
    toggle(itemId);
    addToast(active ? 'Removed from wishlist' : 'Added to wishlist', active ? 'info' : 'success');
  };

  return (
    <button
      className={`wishlist-btn wishlist-btn--${size}${active ? ' wishlist-btn--active' : ''}`}
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart size={size === 'lg' ? 20 : 16} fill={active ? 'currentColor' : 'none'} />
      <span>{active ? 'Wishlisted' : 'Add to Wishlist'}</span>
    </button>
  );
}
