import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar({ placeholder = 'Search items...', onSearch, inline = false }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(`/items?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form
      className={`searchbar${inline ? ' searchbar--inline' : ' searchbar--hero'}`}
      onSubmit={handleSubmit}
    >
      <Search size={18} className="searchbar__icon" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="searchbar__input"
      />
      <button type="submit" className="searchbar__btn">Search</button>
    </form>
  );
}
