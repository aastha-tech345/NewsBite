const express = require('express');
const { toggleBookmark, getSavedArticles } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getSavedArticles);
router.post('/:articleId', toggleBookmark);

module.exports = router;
