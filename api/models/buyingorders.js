const mongoose = require('mongoose');
const { nanoid } = require('../lib/nanoid');

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