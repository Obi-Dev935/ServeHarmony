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

const cafes = require('./model/cafeMenu')
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
  const storeId = request.params.id;
  const storeType = request.query.type; // Get the type from the query parameter
  response.render('TableReservation', { storeId: storeId, storeType: storeType });
});


app.post('/submitReservation', authMiddleware.isAuth, (request, response) => {
    try {
        const { storeId, storeType, name, people, date, time, specialRequests } = request.body;
        const newReservation = new Reservation({storeId,storeType, name, people, date, time, specialRequests });
        newReservation.save();

        console.log('Reservation saved:', newReservation);
        if (storeType === 'restaurant') {
          response.redirect(`/restaurant/menu/${storeId}`);
        } else if (storeType === 'cafe') {
          response.redirect(`/cafe/menu/${storeId}`);
        } else {
          response.status(400).send('Invalid store type.');
        } 
    } catch (error) {
        console.error('Failed to save reservation:', error);
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
  const searchQuery = request.query.search || '';

  cafes.find({
      name: { $regex: new RegExp(searchQuery, 'i') }
  }).then(data => {
    console.log(data)
      if (request.headers.accept.includes('application/json')) {
        response.json(data); 
      } else {
        response.render('cafePage', { cafes: data }); 
      }
  }).catch(err => {
      console.error(err);
      response.status(500).send('Error retrieving restaurants.');
  });
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

app.get('/cafe/menu/:id',authMiddleware.isAuth, (request,response) => {
  const cafeid = request.params.id;
  cafes.findById(cafeid)
    .then((data) => {
      request.session.cafeid = cafeid;
      request.session.cart = [];
      response.render('cafemenuPage', { cafe: data });
    })
    .catch((err) => {response.render('cafemenuPage', { cafe: [] });});
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

app.post('/cart/remove', (request, response) => {
  const { menuItemId } = request.body;
  request.session.cart = request.session.cart.filter(item => item.menuItemId !== menuItemId);
  response.json({ success: true });
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
    response.render('receipt', { order: data });
    console.log(data);
  })
  .catch((err) => {
    response.status(500).render('receipt', { order: [] });
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

app.get('/restaurant/dashboard', (req, res) => {
  res.render('restaurantLogin');
});

app.post('/restaurant/dashboard', appController.login_dashboard);

app.get('/restaurant/dashboard/:id',appController.render_dashboard);

app.post('/restaurant/updateOrderStatus/:id', appController.update_order_status);

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