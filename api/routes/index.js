const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/index');

router.post('/login', IndexController.login);
router.get('/users', IndexController.get_users);
router.post('/user', IndexController.get_user);
router.post('/create-user', IndexController.create_user);
router.post('/update-user', IndexController.update_user);

module.exports = router;
