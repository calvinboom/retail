const User = require('../models/users');
const { get } = require('lodash')
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try{
        console.log(req.body)
        req.checkBody('email', 'email is invalid').notEmpty();
        req.checkBody('password', 'password is required').notEmpty();

        const email = get(req.body, 'email', null);
        const password = get(req.body, 'password', null);
        console.log(email)
        var errors = req.validationErrors();

        let isValid = true;
        let resJson = {};
        if (errors) {
            return res.status(400).json({message: 'Auth failed', code: 100, error: errors.map(a => a.msg).join(', '), status: 'nok'});
        } else {
            console.log(email)
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
                console.log('true------- : ', user)
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