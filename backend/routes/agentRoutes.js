const express = require('express');
const {
  createAgent, getAllAgents, updateAgent, deleteAgent, toggleAgent,
} = require('../controllers/agentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly); // all agent routes are admin-only

router.get('/', getAllAgents);
router.post('/', createAgent);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);
router.patch('/:id/toggle', toggleAgent);

module.exports = router;
