const express = require('express');
const router = express.Router();
const BuyItemsController = require('../controllers/buy-items');

router.post('/create', BuyItemsController.create_item);
router.post('/list', BuyItemsController.get_buy_orders);
router.post('/find-by-pid', BuyItemsController.get_buy_items_by_pid);
router.post('/update-status', BuyItemsController.update_status_buying_order);

module.exports = router;