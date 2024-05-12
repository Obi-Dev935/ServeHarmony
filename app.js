const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
app.use(express.static('public')); 
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const appController = require("./controllers/appController");
const authMiddleware = require("./middleware/auth");

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
  store: sessionStore,
}))

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

const cafes = require('./dataCafe')
const restaurants = require('./model/menu');
const Order = require('./model/order');
const Reservation = require('./model/table'); 

app.post("/register", appController.register_post);
app.get("/login", authMiddleware.isLogged, appController.login_get);
app.post("/login", appController.login_post);

app.get('/',(request,response) => {
  response.render('ChoicePage')
});

app.get('/TableReservation/:id',authMiddleware.isAuth,(request, response) => {
  const restaurantId = request.params.id;
  response.render('TableReservation', { restaurantId: restaurantId });
});


app.post('/submitReservation', authMiddleware.isAuth, async (request, response) => {
    try {
        const { restaurantId, name, people, date, time, requests } = request.body;

        const newReservation = new Reservation({
            restaurantId,
            name,
            people,
            date,
            time,
            specialRequests: requests
        });

        await newReservation.save();

        console.log('Reservation saved:', newReservation);
        response.redirect(`/restaurant/menu/${restaurantId}`);
    } catch (error) {
        console.error('Failed to save reservation:', error);
        response.status(500).send('Failed to save reservation.');
    }
});


app.get('/restaurantPage', authMiddleware.isAuth, (req, res) => {
  const searchQuery = req.query.search || '';

  restaurants.find({
      name: { $regex: new RegExp(searchQuery, 'i') }
  }).then(data => {
      if (req.headers.accept.includes('application/json')) {
          res.json(data); 
      } else {
          res.render('restaurantPage', { restaurants: data }); 
      }
  }).catch(err => {
      console.error(err);
      res.status(500).send('Error retrieving restaurants.');
  });
});

app.get('/cafePage',(request,response) => {
  response.render('cafePage', {cafes:cafes})
});

app.get('/reservedTables', async (req, res) => {
  try {
      const reservations = await Reservation.find({}).sort({ date: -1 }); // Sorting by date, newest first
      res.render('reservedTables', { reservations }); 
  } catch (error) {
      console.error('Failed to fetch reservations:', error);
      res.status(500).send('Unable to retrieve reservation data.');
  }
});
app.get('/restaurant/menu/:id',authMiddleware.isAuth, (request,response) => {
  const restaurantid = request.params.id;
  restaurants.findById(restaurantid)
    .then((data) => {
      request.session.restaurantid = restaurantid;
      request.session.cart = [];
      response.render('menu', { restaurants: data });
    })
    .catch((err) => {response.render('menu', { restaurants: [] });});
});

app.get('/restaurant/cart', authMiddleware.isAuth, (request,response) => {
  const cart = request.session.cart;
  response.render('cart', {cart})
});

app.post('/cart/add', authMiddleware.isAuth, (request,response) => {
  const { menuItemId, itemName, itemPrice, itemImg, quantity } = request.body; 
  const cart = request.session.cart
  const existingItem = cart.find(item => item.menuItemId === menuItemId);
  if (existingItem) {
    existingItem.quantity += quantity; // If it exists, increment the quantity
  } else {
    cart.push({ menuItemId,itemName, itemPrice, itemImg, quantity}); // Otherwise, add a new item to the cart with quantity 1
  }

  
  response.status(200).json({ success: true, cart });
});

app.post('/cart/remove', (request, res) => {
  const { menuItemId } = request.body;
  request.session.cart = request.session.cart.filter(item => item.menuItemId !== menuItemId);
  request.json({ success: true });
});

app.post('/restaurant/order/confirm', authMiddleware.isAuth, (request, res) => {
  const cart = request.session.cart;
  if (!cart || cart.length === 0) {
    console.log("cart is empty");
    return res.status(400).send("Cart is empty");
  }
  const order = new Order({
    menuitems: cart,
    restaurantId: request.session.restaurantid,
    phoneNumber: request.session.phoneNumber,
    orderDate: new Date()
  });
  order.save()
  .then((savedOrder) => {
    request.session.cart = []; // Clear the cart
    res.json({ success: true, orderId: savedOrder._id });
  })
  .catch(err => res.status(500).json({error: err }));
});

app.get('/restaurant/receipt/:orderrId', authMiddleware.isAuth, (request, response) => {
  Order.findById(request.params.orderrId)
  .then((data) => {
    if (!data) {
      return response.status(404).send('Order not found');
    }
    response.render('orders', { order: data });
    console.log(data);
  })
  .catch((err) => {
    response.status(500).render('orders', { order: [] });
  });
});

app.get('/user/orders', authMiddleware.isAuth, (request, response) => {
  const phoneNumber = request.session.phoneNumber; 
  if (!phoneNumber) {
    return response.status(400).send("Phone number is not available in session.");
  }
  Order.find({ phoneNumber: phoneNumber })
    .then(orders => {
      response.render('userOrders', { orders: orders });
    })
    .catch(err => {
      console.error("Error fetching orders:", err);
      response.status(500).send("Failed to retrieve orders.");
    });
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
// });