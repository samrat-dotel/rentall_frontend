import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import ItemCard from '../../components/ItemCard/ItemCard';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar';
import { SkeletonGrid } from '../../components/Loader/Loader';
import { items as allItems } from '../../data/items';
import './Items.css';

const PER_PAGE = 8;

export default function Items() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    featured: false,
  });
  const [sort, setSort] = useState('');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid');
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let result = [...allItems];
    if (query) result = result.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()));
    if (filters.category) result = result.filter((i) => i.category === filters.category);
    if (filters.inStock) result = result.filter((i) => i.stock > 0);
    if (filters.featured) result = result.filter((i) => i.featured);
    if (filters.minPrice !== '') result = result.filter((i) => i.price >= Number(filters.minPrice));
    if (filters.maxPrice !== '') result = result.filter((i) => i.price <= Number(filters.maxPrice));

    if (sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'name-asc')   result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'name-desc')  result.sort((a, b) => b.name.localeCompare(a.name));

    return result;
  }, [query, filters, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (q) => {
    setQuery(q);
    setPage(1);
    setSearchParams(q ? { q } : {});
  };

  const handleFiltersChange = (f) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <div className="items-page">
      <div className="container">
        {/* Toolbar */}
        <div className="items-page__toolbar">
          <div className="items-page__search-wrap">
            <SearchBar placeholder="Search items..." onSearch={handleSearch} inline />
          </div>
          <div className="items-page__controls">
            <button className="items-page__filter-toggle" onClick={() => setMobileSidebar(true)}>
              <SlidersHorizontal size={16} /> Filters
            </button>
            <SortDropdown value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
            <div className="items-page__view-toggle">
              <button
                className={`items-page__view-btn${view === 'grid' ? ' items-page__view-btn--active' : ''}`}
                onClick={() => setView('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`items-page__view-btn${view === 'list' ? ' items-page__view-btn--active' : ''}`}
                onClick={() => setView('list')}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="items-page__layout">
          {/* Desktop Sidebar */}
          <div className="items-page__sidebar-wrap">
            <FilterSidebar filters={filters} onChange={handleFiltersChange} />
          </div>

          {/* Results */}
          <div className="items-page__results">
            <div className="items-page__results-header">
              <p className="items-page__count">
                {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {loading ? (
              <SkeletonGrid count={PER_PAGE} />
            ) : paginated.length === 0 ? (
              <div className="items-page__empty">
                <p>No items match your filters.</p>
                <button onClick={() => { setQuery(''); setFilters({ category: '', minPrice: '', maxPrice: '', inStock: false, featured: false }); setPage(1); }} className="items-page__reset-btn">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`items-page__grid${view === 'list' ? ' items-page__grid--list' : ''}`}>
                {paginated.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            )}

            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebar && (
        <>
          <div className="items-page__overlay" onClick={() => setMobileSidebar(false)} />
          <FilterSidebar filters={filters} onChange={handleFiltersChange} onClose={() => setMobileSidebar(false)} isMobile />
        </>
      )}
    </div>
  );
}
