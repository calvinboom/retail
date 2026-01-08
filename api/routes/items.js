const express = require('express');
const router = express.Router();
const ItemsController = require('../controllers/items');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Allowed file types for image uploads
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/static/uploads/image')
    },
    filename: function (req, file, cb) {
        // Use timestamp + original extension to prevent filename conflicts
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueName)
    }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'nok',
                message: 'File size too large. Maximum allowed size is 5MB.'
            });
        }
        return res.status(400).json({
            status: 'nok',
            message: err.message
        });
    } else if (err) {
        return res.status(400).json({
            status: 'nok',
            message: err.message
        });
    }
    next();
};

// All item routes require authentication
router.post('/', authMiddleware, ItemsController.get_items);
router.post('/create', authMiddleware, upload.single('file'), handleMulterError, ItemsController.create_item);
router.post('/info', authMiddleware, ItemsController.get_item);
router.post('/update', authMiddleware, upload.single('file'), handleMulterError, ItemsController.update_item);

module.exports = router;
