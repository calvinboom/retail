const Item = require('../models/items');
const utils = require('../lib/utils');


exports.get_item = async (req, res) => {
    /*let items = [
        {
            name: "น้ำดื่ม",
            type: "1",
            price: 7,
        },{
            name: "นมจืด",
            type: "1",
            price: 12,
        },{
            name: "โค้ก",
            type: "1",
            price: 17,
        },{
            name: "กระทิงแดง",
            type: "1",
            price: 10,
        },{
            name: "น้ำมันพืช",
            type: "2",
            price: 56,
        },{
            name: "น้ำปลา",
            type: "2",
            price: 29,
        },{
            name: "ซีอิ๊วขาว",
            type: "2",
            price: 52,
        },{
            name: "ซอสมะเขือเทศ",
            type: "2",
            price: 24,
        },{
            name: "เลย์ ออริจินอล",
            type: "3",
            price: 20,
        },{
            name: "เลย์ โนริสาหร่าย",
            type: "3",
            price: 20,
        },{
            name: "เยลลี่ YOYO",
            type: "3",
            price: 20,
        },{
            name: "ขนมปังนมฮอกไกโด",
            type: "4",
            price: 13,
        },{
            name: "โดริโทส",
            type: "3",
            price: 20,
        },{
            name: "ขนมปังฟาร์มเฮาส์",
            type: "4",
            price: 22,
        },{
            name: "ขนมปังฟาร์มเฮาส์ ไม่มีขอบ",
            type: "4",
            price: 22,
        },{
            name: "ขนมปังเนย",
            type: "4",
            price: 13,
        },
    ]*/
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