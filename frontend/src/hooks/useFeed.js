import { useState, useCallback, useRef, useEffect } from 'react';
import { getFeed } from '../services/feedService';

const useFeed = (category = '') => {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadingRef = useRef(false);
  const pageRef = useRef(1);

  useEffect(() => {
    setFeed([]);
    setHasMore(true);
    setError(null);
    pageRef.current = 1;
    setPage(1);
  }, [category]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    const currentPage = pageRef.current;

    try {
      const { data } = await getFeed(currentPage, 10, category);
      setFeed((prev) => currentPage === 1 ? data.feed : [...prev, ...data.feed]);
      setHasMore(data.pagination.hasMore);
      pageRef.current = currentPage + 1;
      setPage(currentPage + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [category, hasMore]);

  return { feed, loading, error, hasMore, loadMore };
};

export default useFeed;
