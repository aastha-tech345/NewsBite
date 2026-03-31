const express = require('express');
const { getCampaignStats } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/campaigns', protect, adminOnly, getCampaignStats);

module.exports = router;
