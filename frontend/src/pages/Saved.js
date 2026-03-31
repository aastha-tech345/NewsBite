import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/common/Navbar';
import ArticleCard from '../components/feed/ArticleCard';
import Spinner from '../components/common/Spinner';
import { getSaved } from '../services/feedService';

const Saved = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getSaved();
        setArticles(data.articles);
        setSavedIds(data.articles.map((a) => a._id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleBookmarkToggle = useCallback((articleId) => {
    setArticles((prev) => prev.filter((a) => a._id !== articleId));
    setSavedIds((prev) => prev.filter((id) => id !== articleId));
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Saved Articles</h2>
        {loading && <Spinner />}
        {!loading && articles.length === 0 && (
          <p style={styles.empty}>No saved articles yet. Start bookmarking from your feed.</p>
        )}
        {articles.map((article) => (
          <ArticleCard
            key={article._id}
            article={article}
            savedIds={savedIds}
            onBookmarkToggle={handleBookmarkToggle}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f4f6fb' },
  container: { maxWidth: 680, margin: '0 auto', padding: '16px 16px 40px' },
  heading: { color: '#1a1a2e', marginBottom: 16 },
  empty: { color: '#999', textAlign: 'center', marginTop: 40 },
};

export default Saved;
