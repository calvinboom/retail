const User = require('../models/users');
const { get } = require('lodash')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Load config with fallback
let config = {};
try {
    config = require('../../config.json');
} catch (e) {
    // config.json not found, using env vars
}

// Use environment variable with fallback to config
const JWT_SECRET = process.env.JWT_SECRET || config.token_secret;

exports.login = async (req, res) => {
    try{
        req.checkBody('email', 'email is invalid').notEmpty();
        req.checkBody('password', 'password is required').notEmpty();

        const email = get(req.body, 'email', null);
        const password = get(req.body, 'password', null);
        var errors = req.validationErrors();

        if (errors) {
            return res.status(400).json({message: 'Auth failed', code: 100, error: errors.map(a => a.msg).join(', '), status: 'nok'});
        }

        // Find user first before comparing password
        let user = await User.findOne({ email: email });

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                status: 'nok',
                message: 'Invalid email or password.'
            });
        }

        // Compare password only if user exists
        const isPasswordTrue = await bcrypt.compare(password, user.password);

        if (!isPasswordTrue) {
            return res.status(401).json({
                status: 'nok',
                message: 'Invalid email or password.'
            });
        }

        // Generate token for valid user
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: 'ok',
            message: 'Login success.',
            accessToken: token,
            user: {
                id: user.shortid,
                fname: user.fname,
                lname: user.lname,
                username: user.email,
                email: user.email,
                avatar: user.avatar
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            status: 'nok',
            message: 'Internal server error.'
        });
    }
}


exports.get_users = async (req, res) => {
    try{
        let users = await User.find();
        if(users){
            res.status(200).json({
                status: "ok",
                message: "Get users data",
                data: users,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't get a users data",
                data: null,
            });
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            status: "nok",
            message: "Internal server error",
            data: null,
        });
    }
}

exports.get_user = async (req, res) => {
    try{
        const { id } = req.body;
        let user = await User.findOne({ shortid: id });

        if(!user){
            return res.status(404).json({
                status: "nok",
                message: "User not found",
                data: null,
            });
        }

        let user_data = {
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            role: user.role,
            phone: user.phone
        };

        res.status(200).json({
            status: "ok",
            message: "Get user data",
            data: user_data,
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            status: "nok",
            message: "Internal server error",
            data: null,
        });
    }
}

exports.create_user = async (req, res) => {
    try{
        let { data } = req.body;

        if(!data || !data.password || !data.email){
            return res.status(400).json({
                status: "nok",
                message: "Email and password are required",
                data: null,
            });
        }

        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(data.password, 10, function(err, hash) {
                if (err) reject(err)
                resolve(hash)
            });
        });
        data.password = hashedPassword;
        let user = await User.create(data);
        if(user){
            res.status(200).json({
                status: "ok",
                message: "Create an user successfully",
                data: user,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't create an user",
                data: null,
            });
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            status: "nok",
            message: "Internal server error",
            data: null,
        });
    }
}

exports.update_user = async (req, res) => {
    try{
        let { data, id } = req.body;

        if(!id){
            return res.status(400).json({
                status: "nok",
                message: "User ID is required",
                data: null,
            });
        }

        let user = await User.findOne({ shortid: id });

        if(!user){
            return res.status(404).json({
                status: "nok",
                message: "User not found",
                data: null,
            });
        }

        if(data.password && data.password != ""){
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(data.password, 10, function(err, hash) {
                    if (err) reject(err)
                    resolve(hash)
                });
            });
            user.password = hashedPassword;
        }
        if(data.email) user.email = data.email;
        if(data.fname) user.fname = data.fname;
        if(data.lname) user.lname = data.lname;
        if(data.role) user.role = data.role;
        if(data.phone) user.phone = data.phone;

        await user.save();

        res.status(200).json({
            status: "ok",
            message: "Update user successfully",
            data: user,
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            status: "nok",
            message: "Internal server error",
            data: null,
        });
    }
}