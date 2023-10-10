const Item = require('../models/items');
const utils = require('../lib/utils');
var fs = require('fs');
const moment = require('moment');

exports.get_items = async (req, res) => {
    const { field, keyword } = req.body;
    let filter = {};
    if(field != "all") filter.type = field;
    if (keyword) {
        filter.name = new RegExp(utils.escapeRegExp(keyword), "i");
    }
    let item = await Item.find(filter);
    if (item) {
        res.status(200).json({
            status: "ok",
            message: "Get items data",
            data: item,
        });
    } else {
        res.status(500).json({
            status: "nok",
            message: "Can't get a items data",
            data: null,
        });
    }
}

exports.create_item = async (req, res) => {
    let { name, type, buy_price, sell_price, barcode, qty, expiry_date } = req.body;
    let file = req.file;

    if(buy_price) buy_price = Number(buy_price);
    if(sell_price) sell_price = Number(sell_price);
    if(qty) qty = Number(qty);

    let data = {
        name: name,
        type: type,
        buy_price: buy_price || 0,
        sell_price: sell_price || 0,
        qty: qty || 1,
        barcode: barcode || null,
        expiry_date: moment(expiry_date).toDate() || null
    };

    let item = await Item.create(data);

    if (file) {
        let filesplit = file.filename.split(".");
        let filetype = filesplit[filesplit.length - 1];
        let new_filename = file.destination.split("public")[1] + "/" + item.shortid + "." + filetype;
        fs.rename(file.path, file.destination + "/" + item.shortid + "." + filetype, function (err) {
            if (err) throw err;
        });
        item.image = new_filename;
    }

    await item.save();

    if (item) {
        res.status(200).json({
            status: "ok",
            message: "Create items data",
            data: item,
        });
    } else {
        res.status(500).json({
            status: "nok",
            message: "Can't create a items data",
            data: null,
        });
    }
}

exports.get_item = async (req, res) => {
    const { prod_id } = req.body;
    let item = await Item.findOne({ _id: prod_id });
    if (item) {
        res.status(200).json({
            status: "ok",
            message: "Get item data successfully",
            data: item,
        });
    } else {
        res.status(500).json({
            status: "nok",
            message: "Can't get a item data",
            data: null,
        });
    }
}

exports.update_item = async (req, res) => {
    let { prod_id, name, type, buy_price, sell_price, barcode, qty, expiry_date } = req.body;
    let file = req.file;

    console.log('req.body', req.body)

    if(buy_price) buy_price = Number(buy_price);
    if(sell_price) sell_price = Number(sell_price);
    if(qty) qty = Number(qty);

    let item = await Item.findOne({ _id: prod_id });

    if(name) item.name = name;
    if(type) item.type = type;
    if(buy_price) item.buy_price = buy_price;
    if(sell_price) item.sell_price = sell_price;
    if(qty) item.qty = qty;
    if(barcode) item.barcode = barcode;
    if(expiry_date) item.expiry_date = moment(expiry_date).toDate();
    if (file) {
        let filesplit = file.filename.split(".");
        let filetype = filesplit[filesplit.length - 1];
        let new_filename = file.destination.split("public")[1] + "/" + item.shortid + "." + filetype;
        fs.rename(file.path, file.destination + "/" + item.shortid + "." + filetype, function (err) {
            if (err) throw err;
        });
        item.image = new_filename;
    }

    await item.save();

    if (item) {
        res.status(200).json({
            status: "ok",
            message: "Update item data",
            data: item,
        });
    } else {
        res.status(500).json({
            status: "nok",
            message: "Can't update item data",
            data: null,
        });
    }
}