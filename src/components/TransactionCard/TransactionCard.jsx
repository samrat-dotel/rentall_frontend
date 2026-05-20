import { items } from '../../data/items';
import { users } from '../../data/users';
import './TransactionCard.css';

const STATUS_MAP = {
  paid:      { label: 'Paid',      cls: 'paid' },
  pending:   { label: 'Pending',   cls: 'pending' },
  cancelled: { label: 'Cancelled', cls: 'cancelled' },
};

export default function TransactionCard({ transaction }) {
  const item = items.find((i) => i._id === transaction.item_id);
  const buyer = users.find((u) => u._id === transaction.buyer_id);
  const seller = users.find((u) => u._id === transaction.seller_id);
  const status = STATUS_MAP[transaction.paymentStatus] || { label: transaction.paymentStatus, cls: 'info' };

  return (
    <div className="txn-card">
      <div className="txn-card__image">
        {item && <img src={item.image} alt={item?.name} />}
      </div>
      <div className="txn-card__body">
        <div className="txn-card__top">
          <p className="txn-card__item-name">{item?.name ?? 'Unknown Item'}</p>
          <span className={`badge badge--${status.cls}`}>{status.label}</span>
        </div>
        <div className="txn-card__meta">
          <span>Buyer: <strong>{buyer?.name ?? transaction.buyer_id}</strong></span>
          <span>Seller: <strong>{seller?.name ?? transaction.seller_id}</strong></span>
          <span>Qty: <strong>{transaction.quantity}</strong></span>
          <span>Duration: <strong>{transaction.duration} day{transaction.duration !== 1 ? 's' : ''}</strong></span>
        </div>
        <div className="txn-card__dates">
          <span>{transaction.rentStart}</span>
          <span className="txn-card__arrow">→</span>
          <span>{transaction.rentEnd}</span>
        </div>
      </div>
      <div className="txn-card__id">
        <span className="txn-card__id-label">ID</span>
        <span className="txn-card__id-value">{transaction._id}</span>
      </div>
    </div>
  );
}
