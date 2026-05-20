import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { items } from '../../data/items';
import { transactions } from '../../data/transactions';
import ItemCard from '../../components/ItemCard/ItemCard';
import TransactionCard from '../../components/TransactionCard/TransactionCard';
import { User, Edit3, Check, X } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [tab, setTab] = useState('items');

  const myItems = items.filter((i) => i.userId === user?._id);
  const myTransactions = transactions.filter(
    (t) => t.buyer_id === user?._id || t.seller_id === user?._id
  );

  const handleSave = () => {
    addToast('Profile updated successfully!', 'success');
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-page__layout">
          {/* Sidebar */}
          <aside className="profile-page__sidebar">
            <div className="profile-page__avatar-section">
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="profile-page__avatar" />
              ) : (
                <div className="profile-page__avatar profile-page__avatar--placeholder">
                  {user?.name?.[0] ?? '?'}
                </div>
              )}
              {user?.isAdmin && <span className="profile-page__admin-badge">Admin</span>}
            </div>

            <div className="profile-page__card">
              <div className="profile-page__card-header">
                <h2 className="profile-page__card-title">Profile</h2>
                {!editing ? (
                  <button className="profile-page__edit-btn" onClick={() => setEditing(true)}>
                    <Edit3 size={14} /> Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="profile-page__save-btn" onClick={handleSave}><Check size={14} /></button>
                    <button className="profile-page__cancel-btn" onClick={() => setEditing(false)}><X size={14} /></button>
                  </div>
                )}
              </div>

              {editing ? (
                <div className="profile-page__form">
                  {[
                    { key: 'name',    label: 'Name',    type: 'text' },
                    { key: 'phone',   label: 'Phone',   type: 'tel' },
                    { key: 'address', label: 'Address', type: 'text' },
                  ].map(({ key, label, type }) => (
                    <div key={key} className="profile-page__field">
                      <label>{label}</label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="profile-page__input"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="profile-page__details">
                  <ProfileDetail label="Name"    value={user?.name} />
                  <ProfileDetail label="Email"   value={user?.email} />
                  <ProfileDetail label="Phone"   value={user?.phone || '—'} />
                  <ProfileDetail label="Address" value={user?.address || '—'} />
                </div>
              )}

              <button className="profile-page__logout" onClick={logout}>Sign Out</button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="profile-page__main">
            <div className="profile-page__tabs">
              <button
                className={`profile-page__tab${tab === 'items' ? ' profile-page__tab--active' : ''}`}
                onClick={() => setTab('items')}
              >
                My Items ({myItems.length})
              </button>
              <button
                className={`profile-page__tab${tab === 'transactions' ? ' profile-page__tab--active' : ''}`}
                onClick={() => setTab('transactions')}
              >
                My Transactions ({myTransactions.length})
              </button>
            </div>

            {tab === 'items' && (
              myItems.length === 0 ? (
                <p className="profile-page__empty">You have no listed items.</p>
              ) : (
                <div className="profile-page__items-grid">
                  {myItems.map((item) => <ItemCard key={item._id} item={item} />)}
                </div>
              )
            )}

            {tab === 'transactions' && (
              myTransactions.length === 0 ? (
                <p className="profile-page__empty">No transactions found.</p>
              ) : (
                <div className="profile-page__txn-list">
                  {myTransactions.map((t) => <TransactionCard key={t._id} transaction={t} />)}
                </div>
              )
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
