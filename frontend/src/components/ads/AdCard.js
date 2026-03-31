import { useCallback, useRef } from 'react';
import { trackView, trackClick } from '../../services/adService';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const AdCard = ({ ad }) => {
  const tracked = useRef(false); // prevent double-tracking on re-renders

  const handleVisible = useCallback(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackView(ad._id).catch(() => {});
  }, [ad._id]);

  const ref = useIntersectionObserver(handleVisible, { threshold: 0.5 });

  const handleClick = () => {
    trackClick(ad._id).catch(() => {});
    window.open(ad.targetLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={ref}
      style={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`Sponsored: ${ad.title}`}
    >
      <div style={styles.header}>
        <span style={styles.label}>Sponsored</span>
      </div>
      {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} style={styles.image} />}
      <div style={styles.body}>
        <p style={styles.title}>{ad.title}</p>
        {ad.description && <p style={styles.description}>{ad.description}</p>}
        <span style={styles.cta}>Learn More →</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'linear-gradient(135deg, #fffbea 0%, #fff8d6 100%)',
    border: '1px solid #f0d060',
    borderLeft: '4px solid #f5a623',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '6px 10px 0',
  },
  label: {
    fontSize: 10,
    color: '#a07800',
    background: '#fdeea0',
    padding: '2px 8px',
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 600,
  },
  image: { width: '100%', height: 160, objectFit: 'cover' },
  body: { padding: '8px 14px 14px' },
  title: { fontWeight: 700, fontSize: 15, color: '#2d2d2d', margin: '0 0 6px' },
  description: { fontSize: 13, color: '#666', margin: '0 0 10px', lineHeight: 1.5 },
  cta: {
    fontSize: 12,
    color: '#f5a623',
    fontWeight: 600,
  },
};

export default AdCard;
