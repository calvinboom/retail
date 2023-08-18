const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const config = require('../../config.json');
const nanoid = customAlphabet(config.SHORTID_CHARACTERS_NON_SPECIAL, 10);

const itemsSchema = mongoose.Schema({
	_id: { type:mongoose.Schema.Types.ObjectId, auto: true },
    shortid: { type: String, default: () => nanoid() },
    name: { type: String },
    type: { type: String },
    price: { type: Number },
    image: { type: String, default: null },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemsSchema);