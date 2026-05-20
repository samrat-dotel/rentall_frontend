import { createContext, useContext, useState, useCallback } from 'react';

const RecentlyViewedContext = createContext(null);

export function RecentlyViewedProvider({ children }) {
  const [viewed, setViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('urbanoma_recent') || '[]');
    } catch {
      return [];
    }
  });

  const addViewed = useCallback((itemId) => {
    setViewed((prev) => {
      const next = [itemId, ...prev.filter((id) => id !== itemId)].slice(0, 8);
      localStorage.setItem('urbanoma_recent', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ viewed, addViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext);
}
