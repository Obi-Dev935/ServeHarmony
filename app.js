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


app.post("/register", appController.register_post);
app.get("/login", authMiddleware.isLogged, appController.login_get);
app.post("/login", appController.login_post);

app.get('/',appController.homePage_get);

app.get('/TableReservation/:id',authMiddleware.isAuth,appController.TableReservation_get);

app.post('/submitReservation', authMiddleware.isAuth,appController.TableReservation_post);

app.get('/restaurantPage', authMiddleware.isAuth,appController.restaurantPage_get);

app.get('/cafePage',authMiddleware.isAuth,appController.cafePage_get);

app.get('/reservedTables', appController.tables_get);

app.get('/restaurant/menu/:id',authMiddleware.isAuth,appController.restaurant_get);

app.get('/cafe/menu/:id',authMiddleware.isAuth,appController.cafe_get);

app.get('/restaurant/cart', authMiddleware.isAuth, appController.cart_get);

app.post('/cart/add', authMiddleware.isAuth, appController.cart_post);

app.post('/cart/remove', authMiddleware.isAuth, appController.cartRemove_post);

app.post('/restaurant/order/confirm', authMiddleware.isAuth, appController.confirmOrder_post);

app.get('/restaurant/receipt/:orderrId', authMiddleware.isAuth, appController.receipt_get);

app.get('/user/orders', authMiddleware.isAuth, appController.userOrders_get);

app.get('/restaurant/dashboard', appController.restaurantDashboard_get);

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