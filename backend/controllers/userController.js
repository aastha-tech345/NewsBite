const User = require('../models/User');
const Article = require('../models/Article');

const updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;
    if (!Array.isArray(preferences)) {
      return res.status(400).json({ success: false, message: 'Preferences must be an array' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true, runValidators: true }
    );
    res.json({ success: true, preferences: user.preferences });
  } catch (err) {
    next(err);
  }
};

const toggleBookmark = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    const user = await User.findById(req.user._id);
    const isBookmarked = user.savedArticles.includes(articleId);

    if (isBookmarked) {
      user.savedArticles = user.savedArticles.filter((id) => id.toString() !== articleId);
    } else {
      user.savedArticles.push(articleId);
    }

    await user.save();
    res.json({
      success: true,
      bookmarked: !isBookmarked,
      message: isBookmarked ? 'Bookmark removed' : 'Article bookmarked',
    });
  } catch (err) {
    next(err);
  }
};

const getSavedArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id).populate({
      path: 'savedArticles',
      options: { sort: { pubDate: -1 }, skip, limit },
    });

    res.json({ success: true, articles: user.savedArticles, page, limit });
  } catch (err) {
    next(err);
  }
};

module.exports = { updatePreferences, toggleBookmark, getSavedArticles };
