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

const restaurantSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String},
  openHours: { type: String, required: true },
  address: { type: String, required: true },
  tables: { type: String, required: true },
  categories: [categorySchema] // Embedding categories in restaurants
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
// use('restaurants');

// // Create a new document in the collection.
// db.getCollection('restaurants').insertOne({
//     name: "bird",
//     address: "1 street",
//     categories: [
//         {
//             name: "Burger",
//             items: [
//                 {
//                     name: "Chicken",
//                     img: "e",
//                     details: "A burger",
//                     price: 12
//                     }
//             ] // Embedding menu items in categories
//         }
//     ]
      
// });
