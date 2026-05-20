import { useState } from 'react';
import TransactionCard from '../../components/TransactionCard/TransactionCard';
import { transactions } from '../../data/transactions';
import './Transactions.css';

const STATUSES = ['all', 'paid', 'pending', 'cancelled'];

export default function Transactions() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter((t) => t.paymentStatus === filter);

  return (
    <div className="transactions-page">
      <div className="container">
        <div className="transactions-page__header">
          <h1 className="transactions-page__title">Transactions</h1>
          <p className="transactions-page__sub">Track all your rental activity.</p>
        </div>

        {/* Stats */}
        <div className="transactions-page__stats">
          {[
            { label: 'Total',     value: transactions.length,                                       color: 'neutral' },
            { label: 'Paid',      value: transactions.filter((t) => t.paymentStatus === 'paid').length,      color: 'success' },
            { label: 'Pending',   value: transactions.filter((t) => t.paymentStatus === 'pending').length,   color: 'warning' },
            { label: 'Cancelled', value: transactions.filter((t) => t.paymentStatus === 'cancelled').length, color: 'error' },
          ].map((s) => (
            <div key={s.label} className={`transactions-page__stat transactions-page__stat--${s.color}`}>
              <span className="transactions-page__stat-value">{s.value}</span>
              <span className="transactions-page__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="transactions-page__tabs">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`transactions-page__tab${filter === s ? ' transactions-page__tab--active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <p className="transactions-page__empty">No transactions with this status.</p>
        ) : (
          <div className="transactions-page__list">
            {filtered.map((t) => (
              <TransactionCard key={t._id} transaction={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
