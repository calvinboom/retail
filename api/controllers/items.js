const Item = require('../models/items');
const utils = require('../lib/utils');
var fs = require('fs');

exports.get_items = async (req, res) => {
    /*let items = [
        {
            name: "น้ำดื่ม",
            type: "1",
            image: null,
            barcode: null,
            buy_price: "5",
            sell_price: 7,
        },{
            name: "นมจืด",
            type: "1",
            image: null,
            barcode: null,
            buy_price: "7",
            sell_price: 12,
        },{
            name: "โค้ก",
            type: "1",
            image: null,
            barcode: null,
            buy_price: "14",
            sell_price: 17,
        },{
            name: "กระทิงแดง",
            type: "1",
            image: null,
            barcode: null,
            buy_price: "7",
            sell_price: 10,
        },{
            name: "น้ำมันพืช",
            type: "2",
            image: null,
            barcode: null,
            buy_price: "48",
            sell_price: 56,
        },{
            name: "น้ำปลา",
            type: "2",
            image: null,
            barcode: null,
            buy_price: "24",
            sell_price: 29,
        },{
            name: "ซีอิ๊วขาว",
            type: "2",
            image: null,
            barcode: null,
            buy_price: "45",
            sell_price: 52,
        },{
            name: "ซอสมะเขือเทศ",
            type: "2",
            image: null,
            barcode: null,
            buy_price: "20",
            sell_price: 24,
        },{
            name: "เลย์ ออริจินอล",
            type: "3",
            image: null,
            barcode: null,
            buy_price: "17",
            sell_price: 20,
        },{
            name: "เลย์ โนริสาหร่าย",
            type: "3",
            image: null,
            barcode: null,
            buy_price: "17",
            sell_price: 20,
        },{
            name: "เยลลี่ YOYO",
            type: "3",
            image: null,
            barcode: null,
            buy_price: "18",
            sell_price: 20,
        },{
            name: "ขนมปังนมฮอกไกโด",
            type: "4",
            image: null,
            barcode: null,
            buy_price: "10",
            sell_price: 13,
        },{
            name: "โดริโทส",
            type: "3",
            image: null,
            barcode: null,
            buy_price: "18",
            sell_price: 20,
        },{
            name: "ขนมปังฟาร์มเฮาส์",
            type: "4",
            image: null,
            barcode: null,
            buy_price: "19",
            sell_price: 22,
        },{
            name: "ขนมปังฟาร์มเฮาส์ ไม่มีขอบ",
            type: "4",
            image: null,
            barcode: null,
            buy_price: "19",
            sell_price: 22,
        },{
            name: "ขนมปังเนย",
            type: "4",
            image: null,
            barcode: null,
            buy_price: "10",
            sell_price: 13,
        },
    ]
    let itemsss = await Item.create(items);
    return false;*/
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
    let { name, type, buy_price, sell_price, barcode, qty } = req.body;
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
        barcode: barcode || null
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
    let { prod_id, name, type, buy_price, sell_price, barcode, qty } = req.body;
    let file = req.file;

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