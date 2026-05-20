import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getMyBookings, cancelBooking } from '../../services/bookingService';
import './Transactions.css';

const STATUSES = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Requested' },
  { key: 'confirmed', label: 'Approved Rentals' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function Transactions() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      if (!user?.token) {
        setBookings([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await getMyBookings(user.token);
        setBookings(data);
      } catch (error) {
        addToast(error.message || 'Could not load your rentals.', 'error');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [user, addToast]);

  /*
    Simple renter notification:
    When owner accepts a request, booking status becomes "confirmed".
    When renter opens My Rentals, they get a toast once.
  */
  useEffect(() => {
    if (!user?._id || bookings.length === 0) return;

    const notifiedKey = `rentall_notified_confirmed_${user._id}`;

    const alreadyNotified = JSON.parse(
      localStorage.getItem(notifiedKey) || '[]'
    );

    const newlyConfirmed = bookings.filter(
      (booking) =>
        booking.status === 'confirmed' &&
        !alreadyNotified.includes(booking._id)
    );

    if (newlyConfirmed.length > 0) {
      newlyConfirmed.forEach((booking) => {
        addToast(
          `Your rental request for "${booking.itemName}" was accepted by the owner.`,
          'success'
        );
      });

      localStorage.setItem(
        notifiedKey,
        JSON.stringify([
          ...alreadyNotified,
          ...newlyConfirmed.map((booking) => booking._id),
        ])
      );
    }
  }, [bookings, user, addToast]);

  const filtered = useMemo(() => {
    if (filter === 'all') return bookings;
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  const stats = [
    {
      label: 'Requested',
      value: bookings.filter((b) => b.status === 'pending').length,
      color: 'warning',
    },
    {
      label: 'Approved',
      value: bookings.filter((b) => b.status === 'confirmed').length,
      color: 'success',
    },
    {
      label: 'Rejected',
      value: bookings.filter((b) => b.status === 'rejected').length,
      color: 'error',
    },
    {
      label: 'Total Amount',
      value: `$${bookings
        .filter((b) => b.status === 'confirmed')
        .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0)
        .toFixed(2)}`,
      color: 'neutral',
    },
  ];

  const getStatusLabel = (status) => {
    if (status === 'pending') return 'Requested';
    if (status === 'confirmed') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    if (status === 'cancelled') return 'Cancelled';
    return status || 'Unknown';
  };

  const getEmptyMessage = () => {
    if (filter === 'pending') return 'No pending rental requests found.';
    if (filter === 'confirmed') return 'No approved rentals found.';
    if (filter === 'rejected') return 'No rejected requests found.';
    if (filter === 'cancelled') return 'No cancelled requests found.';
    return 'No rentals found.';
  };

  const handleCancel = async (bookingId) => {
    if (!user?.token) return;

    setCancellingId(bookingId);

    try {
      const updated = await cancelBooking(bookingId, user.token);

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId ? updated : booking
        )
      );

      addToast('Rental request cancelled successfully.', 'success');
    } catch (error) {
      addToast(error.message || 'Could not cancel rental request.', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="transactions-page">
      <div className="container">
        <div className="transactions-page__header">
          <h1 className="transactions-page__title">My Rentals</h1>

          <p className="transactions-page__sub">
            Track your rental requests, owner approvals, and active rentals.
          </p>
        </div>

        {/* Stats */}
        <div className="transactions-page__stats">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`transactions-page__stat transactions-page__stat--${s.color}`}
            >
              <span className="transactions-page__stat-value">{s.value}</span>
              <span className="transactions-page__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="transactions-page__tabs">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              className={`transactions-page__tab${
                filter === s.key ? ' transactions-page__tab--active' : ''
              }`}
              onClick={() => setFilter(s.key)}
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="transactions-page__empty">
            Loading your rentals...
          </div>
        ) : filtered.length === 0 ? (
          <div className="transactions-page__empty">
            <p>{getEmptyMessage()}</p>

            <Link to="/items" className="transactions-page__browse-btn">
              Browse Items
            </Link>
          </div>
        ) : (
          <div className="transactions-page__list">
            {filtered.map((booking) => (
              <div key={booking._id} className="transactions-page__booking-card">
                <div className="transactions-page__booking-img-wrap">
                  {booking.itemImage ? (
                    <img
                      src={booking.itemImage}
                      alt={booking.itemName}
                      className="transactions-page__booking-img"
                    />
                  ) : (
                    <div className="transactions-page__booking-placeholder">
                      <Package size={22} />
                    </div>
                  )}
                </div>

                <div className="transactions-page__booking-main">
                  <div className="transactions-page__booking-top">
                    <div>
                      <h3 className="transactions-page__booking-title">
                        {booking.itemName}
                      </h3>

                      <p className="transactions-page__booking-id">
                        Request ID: {booking._id}
                      </p>
                    </div>

                    <span
                      className={`transactions-page__status transactions-page__status--${booking.status}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="transactions-page__booking-meta">
                    <span>
                      <Calendar size={15} />
                      {booking.days} day{booking.days !== 1 ? 's' : ''}
                    </span>

                    <span>${Number(booking.pricePerDay || 0).toFixed(2)} / day</span>

                    <span>
                      Total: ${Number(booking.totalPrice || 0).toFixed(2)}
                    </span>

                    <span>Owner: {booking.ownerId || 'N/A'}</span>
                  </div>

                  <div className="transactions-page__booking-footer">
                    <span>
                      Requested:{' '}
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </span>

                    {booking.status === 'pending' && (
                      <button
                        className="transactions-page__cancel-btn"
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                        type="button"
                      >
                        <XCircle size={15} />
                        {cancellingId === booking._id
                          ? 'Cancelling...'
                          : 'Cancel Request'}
                      </button>
                    )}

                    {booking.status === 'confirmed' && (
                      <span className="transactions-page__approved-note">
                        Owner approved this rental.
                      </span>
                    )}

                    {booking.status === 'rejected' && (
                      <span className="transactions-page__rejected-note">
                        Owner rejected this request.
                      </span>
                    )}

                    {booking.status === 'cancelled' && (
                      <span className="transactions-page__cancelled-note">
                        You cancelled this request.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}