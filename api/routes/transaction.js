const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.js');

router.post('/create', TransactionController.create_transaction);
router.post('/list', TransactionController.get_transaction);
router.post('/report', TransactionController.get_transaction_report);

module.exports = router;