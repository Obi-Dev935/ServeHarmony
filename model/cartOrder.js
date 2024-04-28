const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Items = new Schema({
    menuItemId: { type: Schema.ObjectId },
    name: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: {type: Number, required: true}
});

const order = new Schema({
    status: { type: String, required: true },
    menuitems: [Items]
});

module.exports = mongoose.model('Order', order)