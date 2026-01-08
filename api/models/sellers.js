const mongoose = require('mongoose');
const { nanoid } = require('../lib/nanoid');

const sellersSchema = mongoose.Schema({
	_id: { type:mongoose.Schema.Types.ObjectId, auto: true },
    shortid: { type: String, default: () => nanoid() },
    seller_id: { type: String, default: null },
    email: { type: String },
    line_id: { type: String },
	fname: { type: String },
    lname: { type: String },
    shop_name: { type: String },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});

sellersSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Seller', sellersSchema);