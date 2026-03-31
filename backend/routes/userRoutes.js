const express = require('express');
const { updatePreferences } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/preferences', protect, updatePreferences);

module.exports = router;
