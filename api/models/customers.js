const mongoose = require('mongoose');
const { nanoid } = require('../lib/nanoid');

const customersSchema = mongoose.Schema({
	_id: { type:mongoose.Schema.Types.ObjectId, auto: true },
    shortid: { type: String, default: () => nanoid() },
    customer_id: { type: String },
	fname: { type: String },
    lname: { type: String },
    address: { type: String, default: null },
    phone: { type: String, default: null },
    rank: { type: String, default: "bronze" },
    point: { type: Number, default: 0 },
    sp_detail: { type: Number, default: 3 },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});

customersSchema.index({ customer_id: 1 }, { unique: true });

module.exports = mongoose.model('Customer', customersSchema);