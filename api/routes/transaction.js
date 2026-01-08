const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.js');
const authMiddleware = require('../middleware/auth');

// All transaction routes require authentication
router.post('/create', authMiddleware, TransactionController.create_transaction);
router.post('/list', authMiddleware, TransactionController.get_transaction);
router.post('/report', authMiddleware, TransactionController.get_transaction_report);

module.exports = router;