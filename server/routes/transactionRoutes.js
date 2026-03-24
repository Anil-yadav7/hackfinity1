const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createTransaction, getTransactions, getTransaction,
  updateTransaction, deleteTransaction, getSummary,
} = require('../controllers/transactionController');

router.use(protect);

router.route('/').get(getTransactions).post(createTransaction);
router.get('/summary', getSummary);
router.route('/:id').get(getTransaction).patch(updateTransaction).delete(deleteTransaction);

module.exports = router;
