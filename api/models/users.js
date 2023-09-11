const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const config = require('../../config.json');
const nanoid = customAlphabet(config.SHORTID_CHARACTERS_NON_SPECIAL, 10);

const usersSchema = mongoose.Schema({
	_id: { type:mongoose.Schema.Types.ObjectId, auto: true },
    shortid: { type: String, default: () => nanoid() },
    email: { type: String },
    password: { type: String },
	fname: { type: String },
    lname: { type: String },
    avatar: { type: String },
    role: { type: String, default: "user" },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});

usersSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', usersSchema);