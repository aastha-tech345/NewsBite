const express = require('express');
const {
  createAd, getAllAds, updateAd, deleteAd,
  trackView, trackClick, getAdStats,
} = require('../controllers/adController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/view', protect, trackView);
router.post('/click', protect, trackClick);

router.get('/', protect, adminOnly, getAllAds);
router.post('/', protect, adminOnly, createAd);
router.put('/:id', protect, adminOnly, updateAd);
router.delete('/:id', protect, adminOnly, deleteAd);
router.get('/:id/stats', protect, adminOnly, getAdStats);

module.exports = router;
