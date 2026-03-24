const express = require('express');
const router = express.Router();
const fraudController = require('../controllers/fraudController');

router.get('/news', fraudController.getLiveFraudNews);
router.post('/report', fraudController.submitScamReport);
router.post('/check-budget', fraudController.checkBudgetThresholds);

module.exports = router;
