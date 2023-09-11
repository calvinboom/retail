const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const config = require('../../config.json');
const nanoid = customAlphabet(config.SHORTID_CHARACTERS_NON_SPECIAL, 10);

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