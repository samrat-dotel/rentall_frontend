import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Edit3,
  Check,
  X,
  Camera,
  PackagePlus,
  ShoppingBag,
  ClipboardList,
  LogOut,
  Package,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getHybridItems } from '../../services/itemService';
import {
  getMyBookings,
  getOwnerRequests,
} from '../../services/bookingService';

import ItemCard from '../../components/ItemCard/ItemCard';
import './Profile.css';

const STATUS_LABELS = {
  pending: 'Requested',
  confirmed: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { addToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('items');

  const [profileUser, setProfileUser] = useState(user || null);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    profilePic: user?.profilePic || '',
  });

  const [myItems, setMyItems] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [ownerRequests, setOwnerRequests] = useState([]);

  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingRentals, setLoadingRentals] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProfileUser(user);
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      profilePic: user.profilePic || '',
    });
  }, [user, navigate]);

  useEffect(() => {
    async function loadMyItems() {
      if (!user?._id) {
        setMyItems([]);
        setLoadingItems(false);
        return;
      }

      setLoadingItems(true);

      try {
        const hybridItems = await getHybridItems();
        const ownedItems = hybridItems.filter((item) => item.userId === user._id);
        setMyItems(ownedItems);
      } catch (error) {
        console.error('Failed to load my items:', error);
        setMyItems([]);
      } finally {
        setLoadingItems(false);
      }
    }

    loadMyItems();
  }, [user]);

  useEffect(() => {
    async function loadMyRentals() {
      if (!user?.token) {
        setMyRentals([]);
        setLoadingRentals(false);
        return;
      }

      setLoadingRentals(true);

      try {
        const data = await getMyBookings(user.token);
        setMyRentals(data);
      } catch (error) {
        console.error('Failed to load my rentals:', error);
        setMyRentals([]);
      } finally {
        setLoadingRentals(false);
      }
    }

    loadMyRentals();
  }, [user]);

  useEffect(() => {
    async function loadOwnerRequests() {
      if (!user?.token) {
        setOwnerRequests([]);
        setLoadingRequests(false);
        return;
      }

      setLoadingRequests(true);

      try {
        const data = await getOwnerRequests(user.token);
        setOwnerRequests(data);
      } catch (error) {
        console.error('Failed to load owner requests:', error);
        setOwnerRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    }

    loadOwnerRequests();
  }, [user]);

  const stats = useMemo(() => {
    return [
      {
        label: 'Listed Items',
        value: myItems.length,
      },
      {
        label: 'My Rentals',
        value: myRentals.length,
      },
      {
        label: 'Pending Requests',
        value: ownerRequests.filter((r) => r.status === 'pending').length,
      },
    ];
  }, [myItems, myRentals, ownerRequests]);

  const saveUserLocally = (updatedUser) => {
    localStorage.setItem('urbanoma_user', JSON.stringify(updatedUser));

    setProfileUser(updatedUser);

    if (typeof updateUser === 'function') {
      updateUser(updatedUser);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please choose a valid image file.', 'error');
      return;
    }

    const maxSizeInMb = 1;
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      addToast(`Profile image must be smaller than ${maxSizeInMb}MB.`, 'error');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((current) => ({
        ...current,
        profilePic: reader.result,
      }));

      const updatedUser = {
        ...profileUser,
        profilePic: reader.result,
      };

      saveUserLocally(updatedUser);
      addToast('Profile image updated.', 'success');
    };

    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!profileUser) return;

    if (!form.name.trim()) {
      addToast('Name is required.', 'error');
      return;
    }

    const updatedUser = {
      ...profileUser,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      profilePic: form.profilePic,
    };

    saveUserLocally(updatedUser);
    setEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleCancel = () => {
    setForm({
      name: profileUser?.name || '',
      phone: profileUser?.phone || '',
      address: profileUser?.address || '',
      profilePic: profileUser?.profilePic || '',
    });

    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!profileUser) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-page__layout">
          {/* Sidebar */}
          <aside className="profile-page__sidebar">
            <div className="profile-page__avatar-section">
              <div className="profile-page__avatar-wrap">
                {form.profilePic ? (
                  <img
                    src={form.profilePic}
                    alt={profileUser.name}
                    className="profile-page__avatar"
                  />
                ) : (
                  <div className="profile-page__avatar profile-page__avatar--placeholder">
                    {profileUser?.name?.[0] ?? '?'}
                  </div>
                )}

                <label
                  htmlFor="profileImage"
                  className="profile-page__avatar-upload"
                  title="Change profile image"
                >
                  <Camera size={15} />
                </label>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="profile-page__avatar-input"
                  onChange={handleProfileImageChange}
                />
              </div>

              {profileUser?.isAdmin && (
                <span className="profile-page__admin-badge">Admin</span>
              )}
            </div>

            <div className="profile-page__card">
              <div className="profile-page__card-header">
                <h2 className="profile-page__card-title">Profile</h2>

                {!editing ? (
                  <button
                    className="profile-page__edit-btn"
                    onClick={() => setEditing(true)}
                    type="button"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                ) : (
                  <div className="profile-page__edit-actions">
                    <button
                      className="profile-page__save-btn"
                      onClick={handleSave}
                      type="button"
                      title="Save"
                    >
                      <Check size={14} />
                    </button>

                    <button
                      className="profile-page__cancel-btn"
                      onClick={handleCancel}
                      type="button"
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <div className="profile-page__form">
                  <div className="profile-page__field">
                    <label>Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="profile-page__input"
                    />
                  </div>

                  <div className="profile-page__field">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="profile-page__input"
                    />
                  </div>

                  <div className="profile-page__field">
                    <label>Address</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, address: e.target.value }))
                      }
                      className="profile-page__input"
                    />
                  </div>
                </div>
              ) : (
                <div className="profile-page__details">
                  <ProfileDetail label="Name" value={profileUser?.name} />
                  <ProfileDetail label="Email" value={profileUser?.email} />
                  <ProfileDetail label="Phone" value={profileUser?.phone || '—'} />
                  <ProfileDetail
                    label="Address"
                    value={profileUser?.address || '—'}
                  />
                </div>
              )}

              <button
                className="profile-page__logout"
                onClick={handleLogout}
                type="button"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="profile-page__main">
            <div className="profile-page__tabs">
              <button
                className={`profile-page__tab${
                  tab === 'items' ? ' profile-page__tab--active' : ''
                }`}
                onClick={() => setTab('items')}
                type="button"
              >
                My Items ({myItems.length})
              </button>

              <button
                className={`profile-page__tab${
                  tab === 'rentals' ? ' profile-page__tab--active' : ''
                }`}
                onClick={() => setTab('rentals')}
                type="button"
              >
                My Rentals ({myRentals.length})
              </button>

              <button
                className={`profile-page__tab${
                  tab === 'requests' ? ' profile-page__tab--active' : ''
                }`}
                onClick={() => setTab('requests')}
                type="button"
              >
                Rental Requests ({ownerRequests.length})
              </button>
            </div>

            {tab === 'items' && (
              <section className="profile-page__panel">
                <div className="profile-page__panel-header">
                  <div>
                    <h2>My Listed Items</h2>
                    <p>Items you have listed as an owner.</p>
                  </div>

                  <Link to="/add-item" className="profile-page__panel-btn">
                    <PackagePlus size={15} />
                    List New Item
                  </Link>
                </div>

                {loadingItems ? (
                  <p className="profile-page__empty">Loading your listed items...</p>
                ) : myItems.length === 0 ? (
                  <div className="profile-page__empty-card">
                    <Package size={28} />
                    <p>You have no listed items yet.</p>
                    <Link to="/add-item" className="profile-page__panel-btn">
                      List an Item
                    </Link>
                  </div>
                ) : (
                  <div className="profile-page__items-grid">
                    {myItems.map((item) => (
                      <ItemCard key={item._id} item={item} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {tab === 'rentals' && (
              <section className="profile-page__panel">
                <div className="profile-page__panel-header">
                  <div>
                    <h2>My Rentals</h2>
                    <p>Rental requests you sent to item owners.</p>
                  </div>

                  <Link to="/transactions" className="profile-page__panel-btn">
                    <ShoppingBag size={15} />
                    Open My Rentals
                  </Link>
                </div>

                {loadingRentals ? (
                  <p className="profile-page__empty">Loading your rentals...</p>
                ) : myRentals.length === 0 ? (
                  <div className="profile-page__empty-card">
                    <ShoppingBag size={28} />
                    <p>You have not requested any rentals yet.</p>
                    <Link to="/items" className="profile-page__panel-btn">
                      Browse Items
                    </Link>
                  </div>
                ) : (
                  <div className="profile-page__request-list">
                    {myRentals.slice(0, 5).map((booking) => (
                      <RentalRow
                        key={booking._id}
                        booking={booking}
                        mode="renter"
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {tab === 'requests' && (
              <section className="profile-page__panel">
                <div className="profile-page__panel-header">
                  <div>
                    <h2>Rental Requests</h2>
                    <p>Requests sent by renters for your listed items.</p>
                  </div>

                  <Link to="/owner-requests" className="profile-page__panel-btn">
                    <ClipboardList size={15} />
                    Manage Requests
                  </Link>
                </div>

                {loadingRequests ? (
                  <p className="profile-page__empty">Loading rental requests...</p>
                ) : ownerRequests.length === 0 ? (
                  <div className="profile-page__empty-card">
                    <ClipboardList size={28} />
                    <p>No renters have requested your items yet.</p>
                    <Link to="/add-item" className="profile-page__panel-btn">
                      List More Items
                    </Link>
                  </div>
                ) : (
                  <div className="profile-page__request-list">
                    {ownerRequests.slice(0, 5).map((booking) => (
                      <RentalRow
                        key={booking._id}
                        booking={booking}
                        mode="owner"
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileDetail({ label, value }) {
  return (
    <div className="profile-page__detail">
      <span className="profile-page__detail-label">{label}</span>
      <span className="profile-page__detail-value">{value}</span>
    </div>
  );
}

function RentalRow({ booking, mode }) {
  const statusLabel = STATUS_LABELS[booking.status] || booking.status || 'Unknown';

  return (
    <div className="profile-page__rental-row">
      <div className="profile-page__rental-image">
        {booking.itemImage ? (
          <img src={booking.itemImage} alt={booking.itemName} />
        ) : (
          <Package size={22} />
        )}
      </div>

      <div className="profile-page__rental-main">
        <div className="profile-page__rental-top">
          <h3>{booking.itemName}</h3>

          <span
            className={`profile-page__rental-status profile-page__rental-status--${booking.status}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="profile-page__rental-meta">
          <span>ID: {booking._id}</span>
          <span>
            {booking.days} day{booking.days !== 1 ? 's' : ''}
          </span>
          <span>Total: ${Number(booking.totalPrice || 0).toFixed(2)}</span>
          <span>{mode === 'owner' ? `Renter: ${booking.userId}` : `Owner: ${booking.ownerId || 'N/A'}`}</span>
        </div>
      </div>
    </div>
  );
}