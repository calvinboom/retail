const express = require('express');
const router = express.Router();
const ItemsController = require('../controllers/items');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/static/uploads/image')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})
let upload = multer({ storage: storage });

router.post('/', ItemsController.get_items);
router.post('/create', upload.single('file'), ItemsController.create_item);
router.post('/info', ItemsController.get_item);
router.post('/update', upload.single('file'), ItemsController.update_item);

module.exports = router;
