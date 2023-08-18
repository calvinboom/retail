const express = require('express');
const router = express.Router();
const ItemsController = require('../controllers/items');

router.post('/', ItemsController.get_item);

module.exports = router;
