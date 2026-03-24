const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const protect = require('../middleware/authMiddleware');

// GET /api/insights/generate - requires auth
router.get('/generate', protect, aiController.generateInsights);

// POST /api/insights/parse-sms
router.post('/parse-sms', aiController.parseSms);

module.exports = router;
