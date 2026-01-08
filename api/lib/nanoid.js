const { customAlphabet } = require('nanoid');

// Default characters for shortid generation
const SHORTID_CHARACTERS = process.env.SHORTID_CHARACTERS ||
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Create nanoid generator with 10 character length
const nanoid = customAlphabet(SHORTID_CHARACTERS, 10);

module.exports = { nanoid, SHORTID_CHARACTERS };
