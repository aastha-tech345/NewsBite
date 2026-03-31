import React, { useState, useEffect, useCallback } from 'react';
import FeedList from '../components/feed/FeedList';
import CategoryTabs from '../components/feed/CategoryTabs';
import Navbar from '../components/common/Navbar';
import useFeed from '../hooks/useFeed';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { useAuth } from '../context/AuthContext';

const Feed = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [savedIds, setSavedIds] = useState(user?.savedArticles?.map(String) || []);

  const category = activeTab === 'all' ? '' : activeTab;
  const { feed, loading, error, hasMore, loadMore } = useFeed(category);

  // Initial load — fires when category changes (useFeed resets internally)
  useEffect(() => {
    loadMore();
  }, [category]); // eslint-disable-line

  // Stable callback for the sentinel — only triggers when there's more to load
  const onSentinelVisible = useCallback(() => {
    if (hasMore && !loading) loadMore();
  }, [hasMore, loading, loadMore]);

  // Sentinel ref drives infinite scroll via IntersectionObserver
  const sentinelRef = useIntersectionObserver(onSentinelVisible, { threshold: 0.1 });

  const handleBookmarkToggle = useCallback((articleId) => {
    setSavedIds((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <CategoryTabs active={activeTab} onChange={setActiveTab} />
        {error && <p style={styles.error}>{error}</p>}
        <FeedList
          feed={feed}
          loading={loading}
          hasMore={hasMore}
          savedIds={savedIds}
          onBookmarkToggle={handleBookmarkToggle}
        />
        {/* Invisible sentinel — when this enters the viewport, load next page */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f4f6fb' },
  container: { maxWidth: 680, margin: '0 auto', padding: '16px 16px 40px' },
  error: { color: '#e94560', textAlign: 'center', padding: 12 },
};

export default Feed;
