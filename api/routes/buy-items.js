const express = require('express');
const router = express.Router();
const BuyItemsController = require('../controllers/buy-items');
const authMiddleware = require('../middleware/auth');

// All buy items routes require authentication
router.post('/create', authMiddleware, BuyItemsController.create_item);
router.post('/list', authMiddleware, BuyItemsController.get_buy_orders);
router.post('/find-by-pid', authMiddleware, BuyItemsController.get_buy_items_by_pid);
router.post('/update-status', authMiddleware, BuyItemsController.update_status_buying_order);

module.exports = router;