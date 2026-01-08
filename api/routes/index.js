const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/index');
const authMiddleware = require('../middleware/auth');

// Public route - no authentication required
router.post('/login', IndexController.login);

// Protected routes - require authentication
router.get('/users', authMiddleware, IndexController.get_users);
router.post('/user', authMiddleware, IndexController.get_user);
router.post('/create-user', authMiddleware, IndexController.create_user);
router.post('/update-user', authMiddleware, IndexController.update_user);

module.exports = router;
