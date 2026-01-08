const express = require('express');
const router = express.Router();
const CustomersController = require('../controllers/customers');
const authMiddleware = require('../middleware/auth');

// All customer routes require authentication
router.get('/', authMiddleware, CustomersController.get_customers);
router.post('/', authMiddleware, CustomersController.get_customer);
router.post('/create', authMiddleware, CustomersController.create_customer);
router.post('/update', authMiddleware, CustomersController.update_customer);

module.exports = router;
