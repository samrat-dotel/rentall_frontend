import './SortDropdown.css';

const options = [
  { value: '',          label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc',label: 'Price: High to Low' },
  { value: 'name-asc',  label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="sort-dropdown">
      <label className="sort-dropdown__label" htmlFor="sort-select">Sort by</label>
      <select
        id="sort-select"
        className="sort-dropdown__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
