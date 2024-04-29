const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
app.use(express.static('public')); 
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

let sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'mySessions'
});

sessionStore.on('error', function(error){
  console.log(error);
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60,
  },
  saveUninitialized: true,
  resave: true,
  store: sessionStore
}))

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

const cafes = require('./dataCafe')
const restaurants = require('./model/menu');
const Order = require('./model/order');

app.get('/',(request,response) => {
  response.render('PhonePage')
});
app.get('/ChoicePage',(request,response) => {
  response.render('ChoicePage')
});
app.get('/restaurantPage',(request,response) => {
  restaurants.find()
  .then(data => {
    response.render('restaurantPage', {restaurants: data})
  })
  .catch()
});

app.get('/cafePage',(request,response) => {
  response.render('cafePage', {cafes:cafes})
});

app.get('/restaurant/menu/:id',(request,response) => {
  const restaurantid = request.params.id;
  restaurants.findById(restaurantid)
    .then((data) => {
      request.session.restaurantid = restaurantid;
      request.session.cart = [];
      response.render('menu', { restaurants: data });
    })
    .catch((err) => {
      response.render('menu', { restaurants: [] });
    });
});

app.get('/restaurant/cart', (request,response) => {
  const cart = request.session.cart;
  console.log(cart);
  response.render('cart', {cart})
});

app.post('/cart/add', (request,response) => {
  const { menuItemId, itemName, itemPrice, itemImg, quantity } = request.body; 
  const cart = request.session.cart
  const existingItem = cart.find(item => item.menuItemId === menuItemId);
  if (existingItem) {
    // If it exists, increment the quantity
    existingItem.quantity += quantity;
  } else {
    // Otherwise, add a new item to the cart with quantity 1
    cart.push({ menuItemId,itemName, itemPrice, itemImg, quantity});
  }

  request.session.cart = cart;
  console.log(cart);
  response.status(200).json({ success: true, cart });
});

app.post('/cart/remove', (req, res) => {
  const { menuItemId } = req.body;
  req.session.cart = req.session.cart.filter(item => item.menuItemId !== menuItemId);
  res.json({ success: true });
});

app.post('/restaurant/order/confirm', (req, res) => {
  const cart = req.session.cart;
  if (!cart || cart.length === 0) {
    console.log("cart is empty");
  }
  const order = new Order({
    menuitems: cart,
  });
  order.save()
    .then(() => {
      req.session.cart = []; // Clear the cart
      res.status(200).json({ success: true, message: 'Order confirmed!' });
    })
    .catch(err => res.status(500).json({error: err }));
});

app.get('/restaurant/receipt', (request,response) => {
  response.render('receiptPage')
});

app.use((request,response) => { 
  response.status(404).send('<h1>Error</h1>')
});

mongoose.connect(process.env.MONGO_URI)
  .then(result => {
    console.log(`Successfully connected to database server..`);
    app.listen(process.env.PORT, () => {
      console.log(`Web server listening on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.log(error);
  })
  
  
// app.get('/Register/v1/',(request,response) => {  
//     response.render('Register', {title: 'Add products', message: '', error: ''})
// });
  
// app.post('/Register/v1/', (req, res) => {
//   const name = req.body.name;
//   const Lname = req.body.Lname;
//   const email = req.body.email;
//   const phoneNumber = req.body.phoneNumber;
//   const Country = req.body.Country;
//   const City = req.body.City;
//   const address = req.body.address;
//   const Shipping = req.body.option;
//   let newform = new Form({name: name, Lname: Lname, email: email, phoneNumber: phoneNumber, Country: Country, City: City, address: address, Shipping: Shipping });
//   newform.save()
//     .then((result) => {
//       res.render('Register', {
//         title: 'Add Form', 
//         message: 'Form added successfully',
//         error: ''
//         });
//     })
//     .catch((err) => {
//       console.log(`Error when adding a Form object: ${err}`);
//       res.render('Register', {
//         title: 'Add Form', 
//         message: '',
//         error: `Could not save data to database: ${err}`
//       });
//     });
// });
  
// app.get('/Addproduct/v1/',(request,response) => {
//   response.render('Addproduct', {title: 'Add products', message: '', error: ''})
// });

// app.post('/Addproduct/v1/', (request, response) => {
//   const name = request.body.name;
//   const quantity = request.body.quantity;
//   const price = request.body.price;
//   let newproduct = new Product({name: name, quantity: quantity, price: price});
//   newproduct.save()
//     .then((result) => {
//       response.render('Addproduct', {
//         title: 'Add product', 
//         message: 'product added successfully',
//         error: ''
//       });
//     })
//     .catch((err) => {
//       console.log(`Error when adding a product object: ${err}`);
//       response.render('Addproduct', {
//         title: 'Add product', 
//         message: '',
//         error: `Could not save data to database: ${err}`
//       });
//     });
// });

// app.get('/Search/v1/', (request, response) => {
//   const name = request.query.name;
//   Product.find({"name": {"$regex" : `${name}`, "$options": "i" }})
//     .then(data => {
//       response.render('Search', {name: 'Search Product', products: data, error: ""});
//     })
//     .catch(err => {
//       console.log(`Couldnt search for products ${err}`);
//       response.render('Search', {name: 'Search Product', products: [], error: err});
//     })
// });