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
    restaurantId: { type: String, required: true},
    orderDate: { type: Date, required: true},
    phoneNumber: { type: String},
    menuitems: [ItemsSchema]
});

module.exports = mongoose.model('Order', order)