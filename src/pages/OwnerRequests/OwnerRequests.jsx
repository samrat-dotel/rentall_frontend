import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  getOwnerRequests,
  acceptBooking,
  rejectBooking,
} from '../../services/bookingService';
import './OwnerRequests.css';

const STATUSES = ['all', 'pending', 'confirmed', 'rejected'];

export default function OwnerRequests() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);

  useEffect(() => {
    async function loadRequests() {
      if (!user?.token) {
        setRequests([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await getOwnerRequests(user.token);
        setRequests(data);
      } catch (error) {
        addToast(error.message || 'Could not load rental requests.', 'error');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [user, addToast]);

  const filtered = useMemo(() => {
    if (filter === 'all') return requests;
    return requests.filter((request) => request.status === filter);
  }, [requests, filter]);

  const handleAccept = async (bookingId) => {
    setWorkingId(bookingId);

    try {
      const updated = await acceptBooking(bookingId, user.token);

      setRequests((current) =>
        current.map((request) =>
          request._id === bookingId ? updated : request
        )
      );

      addToast('Rental request accepted.', 'success');
    } catch (error) {
      addToast(error.message || 'Could not accept request.', 'error');
    } finally {
      setWorkingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    setWorkingId(bookingId);

    try {
      const updated = await rejectBooking(bookingId, user.token);

      setRequests((current) =>
        current.map((request) =>
          request._id === bookingId ? updated : request
        )
      );

      addToast('Rental request rejected.', 'success');
    } catch (error) {
      addToast(error.message || 'Could not reject request.', 'error');
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="owner-requests-page">
      <div className="container">
        <div className="owner-requests-page__header">
          <h1>Rental Requests</h1>
          <p>Accept or reject rental requests sent by renters.</p>
        </div>

        <div className="owner-requests-page__tabs">
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              className={`owner-requests-page__tab${
                filter === status ? ' owner-requests-page__tab--active' : ''
              }`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="owner-requests-page__empty">
            Loading rental requests...
          </div>
        ) : filtered.length === 0 ? (
          <div className="owner-requests-page__empty">
            <p>No rental requests found.</p>
            <Link to="/add-item" className="owner-requests-page__btn">
              List an Item
            </Link>
          </div>
        ) : (
          <div className="owner-requests-page__list">
            {filtered.map((request) => (
              <div key={request._id} className="owner-requests-page__card">
                <div className="owner-requests-page__image-wrap">
                  {request.itemImage ? (
                    <img src={request.itemImage} alt={request.itemName} />
                  ) : (
                    <div className="owner-requests-page__placeholder">
                      <Package size={24} />
                    </div>
                  )}
                </div>

                <div className="owner-requests-page__content">
                  <div className="owner-requests-page__top">
                    <div>
                      <h3>{request.itemName}</h3>
                      <p>Request ID: {request._id}</p>
                    </div>

                    <span
                      className={`owner-requests-page__status owner-requests-page__status--${request.status}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="owner-requests-page__meta">
                    <span>Renter: {request.userId}</span>
                    <span>
                      {request.days} day{request.days !== 1 ? 's' : ''}
                    </span>
                    <span>${request.pricePerDay} / day</span>
                    <span>Total: ${Number(request.totalPrice).toFixed(2)}</span>
                  </div>

                  <div className="owner-requests-page__footer">
                    <span>
                      Created:{' '}
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </span>

                    {request.status === 'pending' && (
                      <div className="owner-requests-page__actions">
                        <button
                          type="button"
                          className="owner-requests-page__accept"
                          onClick={() => handleAccept(request._id)}
                          disabled={workingId === request._id}
                        >
                          <CheckCircle size={15} />
                          {workingId === request._id ? 'Accepting...' : 'Accept'}
                        </button>

                        <button
                          type="button"
                          className="owner-requests-page__reject"
                          onClick={() => handleReject(request._id)}
                          disabled={workingId === request._id}
                        >
                          <XCircle size={15} />
                          Reject
                        </button>
                      </div>
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