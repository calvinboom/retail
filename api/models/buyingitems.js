const mongoose = require('mongoose');

const buyingitemsSchema = mongoose.Schema({
	_id: { type:mongoose.Schema.Types.ObjectId, auto: true },
    item_id: { type:mongoose.Schema.Types.ObjectId },
    item_shortid: { type: String },
    name: { type: String },
    type: { type: String },
    qty: { type: Number },
    buy_price: { type: Number },
    pid: { type: String },
    expiry_date: { type: Date },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Buyingitem', buyingitemsSchema);