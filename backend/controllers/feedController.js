const Article = require('../models/Article');
const Ad = require('../models/Ad');
const { getRedis } = require('../config/redis');

const AD_INJECT_EVERY = 5;

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const loadAds = async (category) => {
  if (category) {
    const categoryAds = await Ad.find({ isActive: true, category }).lean();
    if (categoryAds.length > 0) return shuffle(categoryAds);
  }
  const generalAds = await Ad.find({ isActive: true, category: 'general' }).lean();
  if (generalAds.length > 0) return shuffle(generalAds);
  return shuffle(await Ad.find({ isActive: true }).lean());
};

const getFeed = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const category = req.query.category?.toLowerCase().trim() || null;
    const skip = (page - 1) * limit;

    const redis = getRedis();
    const cacheKey = `feed:${category || 'all'}:page:${page}:limit:${limit}`;

    if (redis && process.env.NODE_ENV === 'production') {
      const cached = await redis.get(cacheKey);
      if (cached) return res.json(JSON.parse(cached));
    }

    const query = category ? { category } : {};

    const [articles, total, ads] = await Promise.all([
      Article.find(query).sort({ pubDate: -1 }).skip(skip).limit(limit).lean(),
      Article.countDocuments(query),
      loadAds(category),
    ]);

    const feed = [];
    let adIndex = 0;

    articles.forEach((article, i) => {
      feed.push({ type: 'article', data: article });
      if ((i + 1) % AD_INJECT_EVERY === 0 && ads.length > 0) {
        feed.push({ type: 'ad', data: ads[adIndex % ads.length] });
        adIndex++;
      }
    });

    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
    const response = {
      success: true,
      feed,
      pagination: { page, limit, total, totalPages, hasMore: page < totalPages },
    };

    if (redis && process.env.NODE_ENV === 'production') {
      await redis.setEx(cacheKey, 120, JSON.stringify(response));
    }

    res.set('Cache-Control', 'no-store');
    res.json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = { getFeed };
