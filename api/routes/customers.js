const express = require('express');
const router = express.Router();
const CustomersController = require('../controllers/customers');

router.get('/', CustomersController.get_customers);
router.post('/', CustomersController.get_customer);
router.post('/create', CustomersController.create_customer);
router.post('/update', CustomersController.update_customer);

module.exports = router;
