import { toggleBookmark } from '../../services/feedService';

const ArticleCard = ({ article, savedIds = [], onBookmarkToggle }) => {
  const isBookmarked = savedIds.includes(article._id);

  const handleBookmark = async () => {
    try {
      await toggleBookmark(article._id);
      onBookmarkToggle?.(article._id);
    } catch (err) {
      console.error('Bookmark error:', err.message);
    }
  };

  return (
    <div style={styles.card}>
      {article.imageUrl && (
        <img src={article.imageUrl} alt={article.title} style={styles.image} />
      )}
      <div style={styles.body}>
        <span style={styles.category}>{article.category}</span>
        <a href={article.link} target="_blank" rel="noopener noreferrer" style={styles.title}>
          {article.title}
        </a>
        <p style={styles.desc}>{article.description?.slice(0, 120)}...</p>
        <div style={styles.footer}>
          <span style={styles.source}>{article.source}</span>
          <button onClick={handleBookmark} style={styles.bookmarkBtn} aria-label="Toggle bookmark">
            {isBookmarked ? '🔖 Saved' : '+ Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: { background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginBottom: 16, overflow: 'hidden' },
  image: { width: '100%', height: 180, objectFit: 'cover' },
  body: { padding: 16 },
  category: { fontSize: 11, background: '#e94560', color: '#fff', padding: '2px 8px', borderRadius: 12, textTransform: 'uppercase' },
  title: { display: 'block', marginTop: 8, fontWeight: 600, fontSize: 16, color: '#1a1a2e', textDecoration: 'none', lineHeight: 1.4 },
  desc: { color: '#666', fontSize: 13, marginTop: 6 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  source: { fontSize: 12, color: '#999' },
  bookmarkBtn: { background: 'none', border: '1px solid #e94560', color: '#e94560', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 },
};

export default ArticleCard;
