import { useEffect, useState } from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import FeaturedItems from '../../components/FeaturedItems/FeaturedItems';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import ItemCard from '../../components/ItemCard/ItemCard';
import { SkeletonGrid } from '../../components/Loader/Loader';
import { getHybridItems } from '../../services/itemService';
import { categories } from '../../data/categories';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import './Home.css';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const { viewed } = useRecentlyViewed();

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);

      try {
        const hybridItems = await getHybridItems();
        setItems(hybridItems);
      } catch (error) {
        console.error('Failed to load home items:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const featured = items.filter((i) => i.featured);

  const recentItems = viewed
    .map((id) => items.find((i) => i._id === id))
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div className="home">
      <HeroSection />

      <div className="container">
        {/* Categories strip */}
        <section className="home__section">
          <div className="home__section-header">
            <div className="home__section-title-wrap">
              <span className="home__accent-bar" />
              <h2 className="home__section-title">Shop by Category</h2>
            </div>
          </div>

          <div className="home__categories">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="home__section">
          {loading ? (
            <>
              <div className="home__section-header">
                <div className="home__section-title-wrap">
                  <span className="home__accent-bar" />
                  <h2 className="home__section-title">Favorites</h2>
                </div>
              </div>

              <SkeletonGrid count={5} />
            </>
          ) : (
            <FeaturedItems items={featured} title="Favorites" />
          )}
        </section>

        {/* Search Banner */}
        <section className="home__search-banner">
          <div className="home__search-content">
            <h2 className="home__search-title">Find Your Perfect Rental</h2>

            <p className="home__search-sub">
              Browse thousands of items — rent for a day, a week, or longer.
            </p>

            <SearchBar placeholder="Search for jackets, dresses, accessories..." />
          </div>
        </section>

        {/* Recently Viewed */}
        {recentItems.length > 0 && (
          <section className="home__section">
            <FeaturedItems
              items={recentItems}
              title="Recently Viewed"
              viewMoreLink="/items"
            />
          </section>
        )}

        {/* All Items Preview */}
        <section className="home__section">
          <div className="home__section-header">
            <div className="home__section-title-wrap">
              <span className="home__accent-bar" />
              <h2 className="home__section-title">New Arrivals</h2>
            </div>
          </div>

          {loading ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="home__items-grid">
              {[...items]
  .sort((a, b) => {
    if (a.source === 'backend' && b.source !== 'backend') return -1;
    if (a.source !== 'backend' && b.source === 'backend') return 1;
    return 0;
  })
  .slice(0, 8)
  .map((item) => (
    <ItemCard key={item._id} item={item} />
  ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}