import React from 'react';
import ArticleCard from './ArticleCard';
import AdCard from '../ads/AdCard';
import Spinner from '../common/Spinner';

const FeedList = ({ feed, loading, hasMore, savedIds, onBookmarkToggle }) => (
  <div>
    {feed.map((item, i) =>
      item.type === 'ad'
        ? <AdCard key={`ad-${item.data._id}-${i}`} ad={item.data} />
        : <ArticleCard key={item.data._id} article={item.data} savedIds={savedIds} onBookmarkToggle={onBookmarkToggle} />
    )}
    {loading && <Spinner />}
    {!loading && !hasMore && feed.length > 0 && <p style={styles.end}>You're all caught up</p>}
    {!loading && feed.length === 0 && <p style={styles.end}>No articles found</p>}
  </div>
);

const styles = {
  end: { textAlign: 'center', color: '#999', padding: 16 },
};

export default FeedList;
