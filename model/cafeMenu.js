const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
  menuItemId: { type: Schema.ObjectId },
  name: { type: String, required: true },
  img: { type: String, required: true },
  details: { type: String, required: true },
  price: { type: Number, required: true }
});

const categorySchema = new Schema({
  name: { type: String, required: true },
  items: [menuItemSchema] // Embedding menu items in categories
});

const cafeSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String},
  openHours: { type: String, required: true },
  address: { type: String, required: true },
  tables: { type: String, required: true },
  categories: [categorySchema] // Embedding categories in restaurants
});

module.exports = mongoose.model('Cafe', cafeSchema);