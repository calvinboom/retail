const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/index');

router.post('/api/login', IndexController.login);

module.exports = router;
