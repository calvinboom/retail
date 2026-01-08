const mongoose = require('mongoose');
const { nanoid } = require('../lib/nanoid');

const usersSchema = mongoose.Schema({
	_id: { type:mongoose.Schema.Types.ObjectId, auto: true },
    shortid: { type: String, default: () => nanoid() },
    email: { type: String },
    password: { type: String },
	fname: { type: String },
    lname: { type: String },
    avatar: { type: String },
    role: { type: String, default: "user" },
    phone: { type: String, default: null },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});

usersSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', usersSchema);