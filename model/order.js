const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
    menuItemId: { type: Schema.ObjectId },
    itemName: { type: String, required: true },
    itemImg: { type: String, required: true },
    itemPrice: { type: Number, required: true },
    quantity: {type: Number, required: true}
});

const order = new Schema({
    status: { type: String, required: true, default: 'pending' },
    menuitems: [ItemsSchema]
});

module.exports = mongoose.model('Order', order)