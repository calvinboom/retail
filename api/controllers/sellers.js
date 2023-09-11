const Seller = require('../models/sellers');

exports.get_sellers = async (req, res) => {
    try{
        let sellers = await Seller.find();
        if(sellers){
            res.status(200).json({
                status: "ok",
                message: "Get sellers data",
                data: sellers,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't get a sellers data",
                data: null,
            });
        }
    }catch(err){
        console.log(err)
    }
}

exports.get_seller = async (req, res) => {
    try{
        const { id } = req.body;
        let seller = await Seller.findOne({ shortid: id });
        if(seller){
            res.status(200).json({
                status: "ok",
                message: "Get seller data",
                data: seller,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't get a seller data",
                data: null,
            });
        }
    }catch(err){
        console.log(err)
    }
}

exports.create_seller = async (req, res) => {
    try{
        let { data } = req.body;
        let seller = await Seller.create(data);
        if(seller){
            res.status(200).json({
                status: "ok",
                message: "Create an seller successfully",
                data: seller,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't create an seller",
                data: null,
            });
        }
    }catch(err){
        console.log(err)
    }
}

exports.update_seller = async (req, res) => {
    try{
        let { data, id } = req.body;
        let seller = await Seller.findOne({ shortid: id });

        if(data.email) seller.email = data.email;
        if(data.fname) seller.fname = data.fname;
        if(data.lname) seller.lname = data.lname;
        if(data.line_id) seller.line_id = data.line_id;
        if(data.phone) seller.phone = data.phone;
        if(data.seller_id) seller.seller_id = data.seller_id;
        if(data.shop_name) seller.shop_name = data.shop_name;
        if(data.address) seller.address = data.address;

        await seller.save();

        if(seller){
            res.status(200).json({
                status: "ok",
                message: "Update a seller successfully",
                data: seller,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't update a seller",
                data: null,
            });
        }
    }catch(err){
        console.log(err)
    }
}