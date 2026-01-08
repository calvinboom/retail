const express = require('express');
const router = express.Router();
const SellersController = require('../controllers/sellers');
const authMiddleware = require('../middleware/auth');

// All seller routes require authentication
router.get('/', authMiddleware, SellersController.get_sellers);
router.post('/', authMiddleware, SellersController.get_seller);
router.post('/create', authMiddleware, SellersController.create_seller);
router.post('/update', authMiddleware, SellersController.update_seller);

module.exports = router;
