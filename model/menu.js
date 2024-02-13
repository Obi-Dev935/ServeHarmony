const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: {type: String, required: true},
    img: {type: String, required: true},
    Details: {type: String, required: true},
    quantity: {type: String, required: true},
    price: {type: String}
});
 
module.exports = mongoose.model('menu', menuSchema);