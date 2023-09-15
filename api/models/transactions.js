const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const config = require('../../config.json');
const nanoid = customAlphabet(config.SHORTID_CHARACTERS_NON_SPECIAL, 10);

const transactionsSchema = mongoose.Schema({
	_id: { type:mongoose.Schema.Types.ObjectId, auto: true },
    shortid: { type: String, default: () => nanoid() },
    name: { type: String },
    type: { type: String },
    qty: { type: Number },
    buy_price: { type: Number },
    sell_price: { type: Number },
    profit: { type: Number },
    image: { type: String, default: null },
    barcode: { type: String, default: null },
    payment_type: { type: String, default: null },
    customer: { type:mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false },
    sell_user: { type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tx_id: { type: String },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionsSchema);