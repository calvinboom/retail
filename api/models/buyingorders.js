const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const config = require('../../config.json');
const nanoid = customAlphabet(config.SHORTID_CHARACTERS_NON_SPECIAL, 10);

const buyingordersSchema = mongoose.Schema({
	_id: { type:mongoose.Schema.Types.ObjectId, auto: true },
    shortid: { type: String, default: () => nanoid() },
    pid: { type: String },
    status: { type: String },
    total_price: { type: Number },
    buy_user: { type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Buyingorder', buyingordersSchema);