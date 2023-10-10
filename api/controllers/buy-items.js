const BuyingItem = require('../models/buyingitems');
const BuyingOrder = require('../models/buyingorders');
const User = require('../models/users');
const Item = require('../models/items');
const moment = require('moment');

exports.create_item = async (req, res) => {
    let { data_items, order_items } = req.body;

    let CountBuyingOrder = await BuyingOrder.countDocuments();
    let user = await User.findOne({ shortid: order_items.buy_user });

    let createBO = {
        pid: String(Number(CountBuyingOrder) + 1).padStart(8, '0'),
        status: order_items.status,
        total_price: order_items.total_price,
        buy_user: user._id,
    }

    let buyingOrder = await BuyingOrder.create(createBO);

    let buyItem = [];

    for(let index in data_items){
        let item = data_items[index];
        buyItem.push({
            item_id: item._id,
            item_shortid: item.shortid,
            name: item.name,
            type: item.type,
            qty: item.qty,
            buy_price: item.buy_price,
            pid: buyingOrder.pid,
            expiry_date: item.expiry_date
        })
    }

    let buyingItem = await BuyingItem.create(buyItem);

    if(order_items.status == 'success'){
        for(let index in data_items){
            let item = data_items[index];
            let addItem = await Item.findOne({ shortid: item.shortid });
            addItem.qty = Number(addItem?.qty || 0) + Number(item.qty);
            addItem.expiry_date = item.expiry_date;
            await addItem.save();
        }
    }

    if (buyingOrder && buyingItem) {
        res.status(200).json({
            status: "ok",
            message: "Create items data success",
        });
    } else {
        res.status(500).json({
            status: "nok",
            message: "Can't create a items data",
        });
    }
}

exports.get_buy_orders = async (req, res) => {
    const { start, end , order } = req.body;
    let sort_direction = "desc";
    if(order) sort_direction = order.sort;

    let buyingOrders = await BuyingOrder.find({ created_date: { "$gte": moment.utc(start).toDate(), "$lte": moment.utc(end).toDate() } }).sort({ created_date: sort_direction }).populate('buy_user');
    
    if (buyingOrders) {
        res.status(200).json({
            status: "ok",
            message: "Get buyingOrders data",
            data: buyingOrders,
        });
    } else {
        res.status(500).json({
            status: "nok",
            message: "Can't get a buyingOrders data",
            data: null,
        });
    }
}

exports.get_buy_items_by_pid = async (req, res) => {
    const { pid } = req.body;

    let buyingItems = await BuyingItem.find({ pid: pid });
    
    if (buyingItems) {
        res.status(200).json({
            status: "ok",
            message: "Get buyingItems data",
            data: buyingItems,
        });
    } else {
        res.status(500).json({
            status: "nok",
            message: "Can't get a buyingItems data",
            data: null,
        });
    }
}

exports.update_status_buying_order = async (req, res) => {
    const { pid, status } = req.body;

    let buyingOrder = await BuyingOrder.findOne({ pid: pid });
    buyingOrder.status = status;
    await buyingOrder.save();

    if(status == 'success'){
        let buyingItems = await BuyingItem.find({ pid: pid });
        for(let index in buyingItems){
            let item = buyingItems[index];
            let addItem = await Item.findOne({ shortid: item.item_shortid });
            addItem.qty = Number(addItem.qty) + Number(item.qty);
            addItem.expiry_date = item.expiry_date;
            await addItem.save();
        }
    }

    if (buyingOrder) {
        res.status(200).json({
            status: "ok",
            message: "Update buyingOrder data",
        });
    } else {
        res.status(500).json({
            status: "nok",
            message: "Can't update a buyingOrder data",
        });
    }
}