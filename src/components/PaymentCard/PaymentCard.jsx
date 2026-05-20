import { CreditCard } from 'lucide-react';
import './PaymentCard.css';

const STATUS_MAP = {
  completed: { label: 'Completed', cls: 'paid' },
  pending:   { label: 'Pending',   cls: 'pending' },
  failed:    { label: 'Failed',    cls: 'cancelled' },
};

export default function PaymentCard({ payment }) {
  const status = STATUS_MAP[payment.status] || { label: payment.status, cls: 'info' };

  return (
    <div className="payment-card">
      <div className="payment-card__icon">
        <CreditCard size={22} />
      </div>
      <div className="payment-card__body">
        <div className="payment-card__top">
          <p className="payment-card__name">{payment.firstName} {payment.lastName}</p>
          <span className={`badge badge--${status.cls}`}>{status.label}</span>
        </div>
        <p className="payment-card__email">{payment.email}</p>
        <div className="payment-card__meta">
          <span className="payment-card__id">{payment.paymentID}</span>
          <span className="payment-card__date">{payment.paymentDate}</span>
          <span className="payment-card__method">{payment.method}</span>
        </div>
      </div>
      <div className="payment-card__amount">
        <span className="payment-card__amount-value">${payment.amount}</span>
        <span className="payment-card__amount-label">USD</span>
      </div>
    </div>
  );
}
