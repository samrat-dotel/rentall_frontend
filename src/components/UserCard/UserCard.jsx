import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import './UserCard.css';

export default function UserCard({ user }) {
  return (
    <div className="user-card">
      <div className="user-card__avatar-wrap">
        {user.profilePic ? (
          <img src={user.profilePic} alt={user.name} className="user-card__avatar" />
        ) : (
          <div className="user-card__avatar user-card__avatar--placeholder">
            {user.name?.[0] ?? '?'}
          </div>
        )}
        {user.isAdmin && (
          <span className="user-card__admin-badge" title="Admin">
            <ShieldCheck size={14} />
          </span>
        )}
      </div>
      <div className="user-card__info">
        <p className="user-card__name">{user.name}</p>
        {user.isAdmin && <span className="user-card__role">Admin</span>}
        <div className="user-card__details">
          <span><Mail size={13} /> {user.email}</span>
          {user.phone && <span><Phone size={13} /> {user.phone}</span>}
          {user.address && <span><MapPin size={13} /> {user.address}</span>}
        </div>
      </div>
    </div>
  );
}
