const Transaction = require('../models/transactions');
const Item = require('../models/items');
const Customer = require('../models/customers');
const User = require('../models/users');
const utils = require('../lib/utils');
const moment = require('moment');

exports.create_transaction = async (req, res) => {
    let { data, payment_type, customer_shortid, sell_user_shortid, tx_id } = req.body;

    if(data){
        let payment_data = [];
        let customer;
        let total_price = 0.0;

        if(customer_shortid != null || customer_shortid != undefined){
            customer = await Customer.findOne({ shortid: customer_shortid });
        }else{
            customer = { 
                _id: null
            };
        }

        let sell_user = await User.findOne({ shortid: sell_user_shortid });

        for(let index in data){
            let item = await Item.findOne({ shortid: data[index].prod_id });

            if(customer_shortid != null || customer_shortid != undefined){
                let buy_price = Number(item.buy_price) * Number(data[index].qty);
                // Fixed: Use proper percentage calculation (sp_detail / 100)
                let discount_rate = Number(customer.sp_detail) / 100;
                let calculate_price = data[index].price - (data[index].price * discount_rate);
                let profit = Number(calculate_price) - Number(buy_price);
                total_price = total_price + calculate_price;

                payment_data.push({
                    name: data[index].name,
                    qty: data[index].qty,
                    sell_price: calculate_price,
                    buy_price: buy_price,
                    profit: profit,
                    type: item.type,
                    payment_type: payment_type,
                    customer: customer._id,
                    sell_user: sell_user._id,
                    tx_id: tx_id
                })
            }else{
                let buy_price = Number(item.buy_price) * Number(data[index].qty);
                let profit = Number(data[index].price) - Number(buy_price);
                total_price = total_price + data[index].price;
                payment_data.push({
                    name: data[index].name,
                    qty: data[index].qty,
                    sell_price: data[index].price,
                    buy_price: buy_price,
                    profit: profit,
                    type: item.type,
                    payment_type: payment_type,
                    customer: customer._id,
                    sell_user: sell_user._id,
                    tx_id: tx_id
                })
            }
        }

        if(customer_shortid != null || customer_shortid != undefined){
            let cal_point = total_price * 0.05;
            customer.point = customer.point + cal_point;
            if(customer.point > 1001){
                customer.rank = "silver";
                customer.sp_detail = 4;
            }
            if(customer.point > 3001){
                customer.rank = "gold";
                customer.sp_detail = 5;
            }
            if(customer.point > 7001){
                customer.rank = "platinum";
                customer.sp_detail = 6;
            }
            if(customer.point > 10001){
                customer.rank = "diamond";
                customer.sp_detail = 7;
            }
            await customer.save();
        }
        
        let create_tx = await Transaction.create(payment_data);
        if(create_tx){
            res.status(200).json({
                status: "ok",
                message: "Create a transaction data successfully.",
                data: create_tx,
            });
        }else{
            res.status(500).json({
                status: "nok",
                message: "Can't create a transaction data.",
                data: null,
            });
        }
    }else{
        res.status(500).json({
            status: "nok",
            message: "Can't create a transaction data.",
            data: null,
        });
    }
}

exports.get_transaction = async (req, res) => {
    const { start, end , order, length, tx_id } = req.body;
    let sort_direction = "asc";
    let transactions;
    if(order) sort_direction = order.sort;

    if(length){
        transactions = await Transaction.find({ created_date: { "$gte": moment.utc(start).toDate(), "$lte": moment.utc(end).toDate() } }).sort({ created_date: sort_direction }).limit(length);
    }else{
        if(tx_id && tx_id != '' && !start && !end){
            transactions = await Transaction.find({ tx_id: tx_id }).populate('customer').populate('sell_user');
        }else{
            transactions = await Transaction.find({ created_date: { "$gte": moment.utc(start).toDate(), "$lte": moment.utc(end).toDate() } }).sort({ created_date: sort_direction }).populate('customer').populate('sell_user');
        }
    }
    
    if (transactions) {
        res.status(200).json({
            status: "ok",
            message: "Get items data",
            data: transactions,
        });
    } else {
        res.status(500).json({
            status: "nok",
            message: "Can't get a items data",
            data: null,
        });
    }
}

exports.get_transaction_report = async (req, res) => {
    const { start, end, type } = req.body;
    if(type == "recent"){
        let transactions = await Transaction.find({ created_date: { "$gte": moment.utc(start).toDate(), "$lte": moment.utc(end).toDate() } });
        if (transactions) {
            let report = {
                total_qty: 0,
                total_sell: 0,
                total_profit: 0
            };
            for(let index in transactions){
                let item = transactions[index];
                report.total_qty = report.total_qty + item.qty;
                report.total_sell = report.total_sell + item.sell_price;
                report.total_profit = report.total_profit + item.profit;
            }
            res.status(200).json({
                status: "ok",
                message: "Get items data",
                data: report,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't get a items data",
                data: null,
            });
        }
    }else {
        let sort_name = "";
        if(type == "bestseller") sort_name = { "qty": -1 };
        if(type == "bestprofit") sort_name = { "profit": -1 };
        let transactions = await Transaction.aggregate([
            { $group : { _id: "$name", qty: { $sum:"$qty" }, buy_price: { $sum:"$buy_price" }, sell_price: { $sum:"$sell_price" }, profit: { $sum:"$profit" }}},
            { $sort: sort_name } 
        ]).limit(5)
        if (transactions) {
            res.status(200).json({
                status: "ok",
                message: "Get items data",
                data: transactions,
            });
        } else {
            res.status(500).json({
                status: "nok",
                message: "Can't get a items data",
                data: null,
            });
        }
    }
}