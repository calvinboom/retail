const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const config = require('../../config.json');
const nanoid = customAlphabet(config.SHORTID_CHARACTERS_NON_SPECIAL, 10);

const itemsSchema = mongoose.Schema({
	_id: { type:mongoose.Schema.Types.ObjectId, auto: true },
    shortid: { type: String, default: () => nanoid() },
    name: { type: String },
    type: { type: String },
    buy_price: { type: Number },
    sell_price: { type: Number },
    qty: { type: Number, default: 0 },
    image: { type: String, default: null },
    barcode: { type: String, default: null },
    expiry_date: { type: Date, default: null },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemsSchema);