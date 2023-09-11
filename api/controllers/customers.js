const Customer = require('../models/customers');

exports.get_customers = async (req, res) => {
    try{
        let customers = await Customer.find();
        if(customers){
            res.status(200).json({
                status: "ok",
                message: "Get customers data",
                data: customers,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't get a customers data",
                data: null,
            });
        }
    }catch(err){
        console.log(err)
    }
}

exports.get_customer = async (req, res) => {
    try{
        const { id } = req.body;
        let customer = await Customer.findOne({ shortid: id });
        if(customer){
            res.status(200).json({
                status: "ok",
                message: "Get customer data",
                data: customer,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't get a customer data",
                data: null,
            });
        }
    }catch(err){
        console.log(err)
    }
}

exports.create_customer = async (req, res) => {
    try{
        let { data } = req.body;

        if(data.rank === "bronze"){
            data.point = 0;
            data.sp_detail = 3;
        }
        if(data.rank === "silver"){ 
            data.point = 1001;
            data.sp_detail = 4;
        }
        if(data.rank === "gold"){ 
            data.point = 3001;
            data.sp_detail = 5;
        }
        if(data.rank === "platinum"){ 
            data.point = 7001;
            data.sp_detail = 6;
        }
        if(data.rank === "diamond"){ 
            data.point = 10001;
            data.sp_detail = 7;
        }

        let customer = await Customer.create(data);
        if(customer){
            res.status(200).json({
                status: "ok",
                message: "Create an customer successfully",
                data: customer,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't create an customer",
                data: null,
            });
        }
    }catch(err){
        console.log(err)
    }
}

exports.update_customer = async (req, res) => {
    try{
        let { data, id } = req.body;
        let customer = await Customer.findOne({ shortid: id });

        if(data.customer_id) customer.customer_id = data.customer_id;
        if(data.email) customer.email = data.email;
        if(data.fname) customer.fname = data.fname;
        if(data.lname) customer.lname = data.lname;
        if(data.phone) customer.phone = data.phone;
        if(data.point) customer.point = data.point;
        if(data.address) customer.address = data.address;
        if(data.rank) customer.rank = data.rank;

        if(customer.rank === "bronze"){
            customer.point = 0;
            customer.sp_detail = 3;
        }
        if(customer.rank === "silver"){ 
            customer.point = 1001;
            customer.sp_detail = 4;
        }
        if(customer.rank === "gold"){ 
            customer.point = 3001;
            customer.sp_detail = 5;
        }
        if(customer.rank === "platinum"){ 
            customer.point = 7001;
            customer.sp_detail = 6;
        }
        if(customer.rank === "diamond"){ 
            customer.point = 10001;
            customer.sp_detail = 7;
        }

        await customer.save();

        if(customer){
            res.status(200).json({
                status: "ok",
                message: "Update a customer successfully",
                data: customer,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't update a customer",
                data: null,
            });
        }
    }catch(err){
        console.log(err)
    }
}