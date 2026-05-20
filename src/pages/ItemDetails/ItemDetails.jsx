import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronLeft, Package, Calendar } from 'lucide-react';
import WishlistButton from '../../components/WishlistButton/WishlistButton';
import ItemCard from '../../components/ItemCard/ItemCard';
import { Loader } from '../../components/Loader/Loader';
import { useToast } from '../../context/ToastContext';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { useAuth } from '../../context/AuthContext';
import {
  getHybridItems,
  getHybridCategories,
} from '../../services/itemService';
import { createBooking } from '../../services/bookingService';
import { users } from '../../data/users';
import './ItemDetails.css';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToast } = useToast();
  const { addViewed } = useRecentlyViewed();
  const { user } = useAuth();

  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(1);
  const [renting, setRenting] = useState(false);

  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);
  const [category, setCategory] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    async function loadItemDetails() {
      setLoading(true);

      try {
        const [hybridItems, hybridCategories] = await Promise.all([
          getHybridItems(),
          getHybridCategories(),
        ]);

        const foundItem = hybridItems.find((i) => i._id === id);

        if (!foundItem) {
          setItem(null);
          setOwner(null);
          setCategory(null);
          setRelated([]);
          return;
        }

        const foundOwner = users.find((u) => u._id === foundItem.userId) || {
          name: 'RentAll Owner',
          email: 'owner@rentall.com',
          profilePic: '',
        };

        const foundCategory = hybridCategories.find(
          (c) => c._id === foundItem.category
        );

        const relatedItems = hybridItems
          .filter(
            (i) =>
              i.category === foundItem.category &&
              i._id !== foundItem._id
          )
          .slice(0, 4);

        setItem(foundItem);
        setOwner(foundOwner);
        setCategory(foundCategory || null);
        setRelated(relatedItems);

        addViewed(foundItem._id);
      } catch (error) {
        console.error('Failed to load item details:', error);
        setItem(null);
        setOwner(null);
        setCategory(null);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    }

    loadItemDetails();
  }, [id, addViewed]);

  if (loading) {
    return (
      <div className="container">
        <Loader fullPage />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container item-details__not-found">
        <p>Item not found.</p>

        <Link to="/items" className="item-details__back-link">
          <ChevronLeft size={16} /> Back to Items
        </Link>
      </div>
    );
  }

  const totalCost = (Number(item.price) * days).toFixed(2);

  const imgList =
    item.images && item.images.length > 0
      ? item.images
      : item.image
        ? [item.image]
        : [];

  const handleRent = async () => {
    if (Number(item.stock) === 0) {
      addToast('This item is out of stock.', 'error');
      return;
    }

    if (!user) {
      addToast('Please login before renting an item.', 'error');
      navigate('/login');
      return;
    }

    setRenting(true);

    try {
      await createBooking(
        {
          itemId: item._id,
          ownerId: item.userId,
          itemName: item.name,
          itemImage: item.image || '',
          pricePerDay: Number(item.price),
          days,
          totalPrice: Number(totalCost),
        },
        user.token
      );

      addToast(`Rental request for "${item.name}" sent to the owner.`, 'success');
    } catch (error) {
      addToast(error.message || 'Could not create booking.', 'error');
    } finally {
      setRenting(false);
    }
  };

  return (
    <div className="container item-details">
      <Link to="/items" className="item-details__breadcrumb">
        <ChevronLeft size={15} /> Back to Items
      </Link>

      <div className="item-details__layout">
        {/* Gallery */}
        <div className="item-details__gallery">
          <div className="item-details__main-image">
            {imgList.length > 0 ? (
              <img src={imgList[activeImg] || item.image} alt={item.name} />
            ) : (
              <div className="item-details__image-placeholder">
                No image available
              </div>
            )}

            {item.featured && (
              <span className="item-details__featured-badge">Featured</span>
            )}
          </div>

          {imgList.length > 1 && (
            <div className="item-details__thumbs">
              {imgList.map((img, i) => (
                <button
                  key={img}
                  className={`item-details__thumb${
                    i === activeImg ? ' item-details__thumb--active' : ''
                  }`}
                  onClick={() => setActiveImg(i)}
                  type="button"
                >
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="item-details__info">
          {category && (
            <span className="item-details__category">{category.name}</span>
          )}

          <h1 className="item-details__name">{item.name}</h1>

          <div className="item-details__price-row">
            <span className="item-details__price">
              ${item.price}
              <span className="item-details__price-unit"> / day</span>
            </span>

            <span
              className={`badge badge--${
                Number(item.stock) > 0 ? 'success' : 'error'
              }`}
            >
              {Number(item.stock) > 0
                ? `${item.stock} in stock`
                : 'Out of stock'}
            </span>
          </div>

          <p className="item-details__description">{item.description}</p>

          <div className="item-details__meta">
            <div className="item-details__meta-item">
              <Package size={15} />
              <span>
                Available from <strong>{item.availableDate || 'Now'}</strong>
              </span>
            </div>

            <div className="item-details__meta-item">
              <Calendar size={15} />
              <span>
                Minimum rental: <strong>1 day</strong>
              </span>
            </div>
          </div>

          {/* Duration picker */}
          <div className="item-details__duration">
            <label className="item-details__duration-label">
              Rental Duration (days)
            </label>

            <div className="item-details__duration-control">
              <button
                onClick={() => setDays((d) => Math.max(1, d - 1))}
                className="item-details__duration-btn"
                type="button"
                disabled={renting}
              >
                −
              </button>

              <span className="item-details__duration-value">{days}</span>

              <button
                onClick={() => setDays((d) => d + 1)}
                className="item-details__duration-btn"
                type="button"
                disabled={renting}
              >
                +
              </button>
            </div>

            <p className="item-details__total">
              Total: <strong>${totalCost}</strong> for {days} day
              {days !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="item-details__actions">
            <button
              className="item-details__rent-btn"
              onClick={handleRent}
              disabled={Number(item.stock) === 0 || renting}
              type="button"
            >
              <ShoppingBag size={18} /> {renting ? 'Booking...' : 'Rent Now'}
            </button>

            <WishlistButton itemId={item._id} size="lg" />
          </div>

          {/* Owner */}
          {owner && (
            <div className="item-details__owner">
              <p className="item-details__owner-label">Listed by</p>

              <div className="item-details__owner-card">
                {owner.profilePic ? (
                  <img
                    src={owner.profilePic}
                    alt={owner.name}
                    className="item-details__owner-avatar"
                  />
                ) : (
                  <div className="item-details__owner-avatar item-details__owner-placeholder">
                    {owner.name?.[0] || 'O'}
                  </div>
                )}

                <div>
                  <p className="item-details__owner-name">{owner.name}</p>
                  <p className="item-details__owner-email">{owner.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Items */}
      {related.length > 0 && (
        <section className="item-details__related">
          <div className="item-details__related-header">
            <span className="item-details__related-bar" />
            <h2 className="item-details__related-title">Related Items</h2>
          </div>

          <div className="item-details__related-grid">
            {related.map((r) => (
              <ItemCard key={r._id} item={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}