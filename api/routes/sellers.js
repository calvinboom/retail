const express = require('express');
const router = express.Router();
const SellersController = require('../controllers/sellers');

router.get('/', SellersController.get_sellers);
router.post('/', SellersController.get_seller);
router.post('/create', SellersController.create_seller);
router.post('/update', SellersController.update_seller);

module.exports = router;
