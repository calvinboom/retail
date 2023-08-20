const express = require('express');
const router = express.Router();
const ItemsController = require('../controllers/items');

router.post('/', ItemsController.get_items);
router.post('/create', ItemsController.create_item);
router.post('/info', ItemsController.get_item);
router.post('/update', ItemsController.update_item);

module.exports = router;
