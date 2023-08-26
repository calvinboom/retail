const Transaction = require('../models/transactions');
const Item = require('../models/items');
const utils = require('../lib/utils');
const moment = require('moment');

exports.create_transaction = async (req, res) => {
    let { data, payment_type } = req.body;
    if(data){
        let payment_data = [];
        for(let index in data){
            let item = await Item.findOne({ shortid: data[index].prod_id });
            let buy_price = Number(item.buy_price) * Number(data[index].qty);
            let profit = Number(data[index].price) - Number(buy_price);
            payment_data.push({
                name: data[index].name,
                qty: data[index].qty,
                sell_price: data[index].price,
                buy_price: buy_price,
                profit: profit,
                type: item.type,
                payment_type: payment_type
            })
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
    const { start, end , order, length } = req.body;
    let sort_direction = "asc";
    let transactions;

    if(order) sort_direction = order.sort;

    if(length){
        transactions = await Transaction.find({ created_date: { "$gte": moment.utc(start).toDate(), "$lte": moment.utc(end).toDate() } }).sort({ created_date: sort_direction }).limit(length);
    }else{
        transactions = await Transaction.find({ created_date: { "$gte": moment.utc(start).toDate(), "$lte": moment.utc(end).toDate() } }).sort({ created_date: sort_direction });
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
    console.log(req.body)
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