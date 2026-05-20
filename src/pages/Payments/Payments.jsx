import { useState } from 'react';
import PaymentCard from '../../components/PaymentCard/PaymentCard';
import { payments } from '../../data/payments';
import './Payments.css';

export default function Payments() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? payments
    : payments.filter((p) => p.status === filter);

  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const completed = payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payments-page">
      <div className="container">
        <div className="payments-page__header">
          <h1 className="payments-page__title">Payments</h1>
          <p className="payments-page__sub">View and manage your payment history.</p>
        </div>

        {/* Summary */}
        <div className="payments-page__summary">
          <div className="payments-page__summary-card">
            <span className="payments-page__summary-label">Total Spent</span>
            <span className="payments-page__summary-value">${total}</span>
          </div>
          <div className="payments-page__summary-card payments-page__summary-card--success">
            <span className="payments-page__summary-label">Confirmed</span>
            <span className="payments-page__summary-value">${completed}</span>
          </div>
          <div className="payments-page__summary-card payments-page__summary-card--warn">
            <span className="payments-page__summary-label">Pending</span>
            <span className="payments-page__summary-value">${total - completed}</span>
          </div>
          <div className="payments-page__summary-card payments-page__summary-card--neutral">
            <span className="payments-page__summary-label">Transactions</span>
            <span className="payments-page__summary-value">{payments.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="payments-page__filters">
          {['all', 'completed', 'pending', 'failed'].map((s) => (
            <button
              key={s}
              className={`payments-page__filter-btn${filter === s ? ' payments-page__filter-btn--active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="payments-page__empty">No payments found.</p>
        ) : (
          <div className="payments-page__list">
            {filtered.map((p) => (
              <PaymentCard key={p._id} payment={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
