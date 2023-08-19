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
    const { start, end } = req.body;
    /*let filter = {};
    if(field != "all") filter.type = field;
    if (keyword) {
        filter.name = new RegExp(utils.escapeRegExp(keyword), "i");
    }*/
    let transactions = await Transaction.find({ created_date: { "$gte": moment.utc(start).toDate(), "$lte": moment.utc(end).toDate() } }).sort({ created_date: 'asc' });
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