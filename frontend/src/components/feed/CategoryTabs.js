import React from 'react';

const CATEGORIES = ['all', 'technology', 'sports', 'business', 'health', 'entertainment', 'science'];

const CategoryTabs = ({ active, onChange }) => (
  <div style={styles.wrapper} role="tablist">
    {CATEGORIES.map((cat) => (
      <button
        key={cat}
        role="tab"
        aria-selected={active === cat}
        onClick={() => onChange(cat)}
        style={{ ...styles.tab, ...(active === cat ? styles.active : {}) }}
      >
        {cat.charAt(0).toUpperCase() + cat.slice(1)}
      </button>
    ))}
  </div>
);

const styles = {
  wrapper: { display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 0', marginBottom: 8 },
  tab: { padding: '6px 16px', borderRadius: 20, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' },
  active: { background: '#e94560', color: '#fff', border: '1px solid #e94560' },
};

export default CategoryTabs;
