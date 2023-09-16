const User = require('../models/users');
const { get } = require('lodash')
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try{
        req.checkBody('email', 'email is invalid').notEmpty();
        req.checkBody('password', 'password is required').notEmpty();

        const email = get(req.body, 'email', null);
        const password = get(req.body, 'password', null);
        var errors = req.validationErrors();

        let isValid = true;
        let resJson = {};
        if (errors) {
            return res.status(400).json({message: 'Auth failed', code: 100, error: errors.map(a => a.msg).join(', '), status: 'nok'});
        } else {
            /*const hashedPassword = await new Promise((resolve, reject) => {
				bcrypt.hash(password, 10, function(err, hash) {
					if (err) reject(err)
					resolve(hash)
				});
			});
            data_owneradmin = {
				email: email,
				password: hashedPassword,
				fname: 'Donlatchanai',
				lname: "Kheereewong"
			}
			await User.create(data_owneradmin);*/
            let user = await User.findOne({ email: email });
            let isPasswordTrue = false;
            await bcrypt.compare(password, user.password).then(function(result) {
                console.log(result)
                if(result == true) isPasswordTrue = true;
            });
            if(user && isPasswordTrue){
                const token = jwt.sign(
                    { userId: user._id },
                    config.token_secret,
                    { expiresIn: '24h' });
                resJson = {
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
                };
            }else{
                console.log('false------- : ', user)
                isValid = false;
                resJson = {
                    status: 'nok',
                    message: 'Password not match.'
                };
            }
        }
        if(isValid){
            res.status(200).json(resJson)
        }else{
            res.status(201).json(resJson)
        }
    }catch(err){
        console.log(err)
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
        console.log(err)
    }
}

exports.get_user = async (req, res) => {
    try{
        const { id } = req.body;
        let user = await User.findOne({ shortid: id });
        let user_data = {
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            role: user.role,
        };
        if(user_data){
            res.status(200).json({
                status: "ok",
                message: "Get user data",
                data: user_data,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't get a user data",
                data: null,
            });
        }
    }catch(err){
        console.log(err)
    }
}

exports.create_user = async (req, res) => {
    try{
        let { data } = req.body;
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
        console.log(err)
    }
}

exports.update_user = async (req, res) => {
    try{
        let { data, id } = req.body;
        let user = await User.findOne({ shortid: id });
        if(data.password && data.password != ""){
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(data.password, 10, function(err, hash) {
                    if (err) reject(err)
                    resolve(hash)
                });
            });
            data.password = hashedPassword;
        }
        if(data.email) user.email = data.email;
        if(data.fname) user.fname = data.fname;
        if(data.lname) user.lname = data.lname;
        if(data.role) user.role = data.role;
        if(data.phone) user.phone = data.phone;

        await user.save();

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
        console.log(err)
    }
}