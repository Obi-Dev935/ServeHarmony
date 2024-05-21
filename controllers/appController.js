const bcrypt = require("bcryptjs");

const User = require("../model/user");
const Order = require('../model/order');
const cafes = require('../model/cafeMenu')
const restaurants = require('../model/menu');
const Reservation = require('../model/table'); 

const login_get = (req, res) => {
  const error = req.session.error;
  req.session.error = undefined;
  res.render("login", { err: error });
};

const login_post = async (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = await User.findOne({ phoneNumber });

  if (!user) {
    req.session.error = "Invalid Credentials";
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.session.error = "Invalid Credentials";
    return res.redirect("/login");
  }

  req.session.isAuth = true;
  req.session.phoneNumber = user.phoneNumber;
  res.redirect("/");
};

const register_post = async (req, res) => {
  const { phoneNumber, password } = req.body;
  let user = await User.findOne({ phoneNumber: phoneNumber });

  if (user) {
    req.session.error = "User already exists";
    return res.redirect("/login");
  }

  const hashPsw = await bcrypt.hash(password, 12);
  user = new User({
    phoneNumber: phoneNumber,
    password: hashPsw,
  });

  await user.save();
  res.redirect("/");
};

const homePage_get = (req, res) => {
  res.render('homePage')
};

const restaurantPage_get = (req, res) => {
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
};

const cafePage_get = (request, response) => {
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
};

const TableReservation_get = (request, response) => {
  const storeId = request.params.id;
  const storeType = request.query.type; // Get the type from the query parameter
  response.render('TableReservation', { storeId: storeId, storeType: storeType });
};

const TableReservation_post = async (request, response) => {
  try {
    const { storeId, storeType, name, people, date, time, specialRequests } = request.body;
    const newReservation = new Reservation({storeId,storeType, name, people, date, time, specialRequests });
    await newReservation.save();

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
};

const restaurant_get = (request, response) => {
  const restaurantid = request.params.id;
  restaurants.findById(restaurantid)
    .then((data) => {
      request.session.restaurantid = restaurantid;
      request.session.cart = [];
      response.render('menu', { restaurants: data });
    })
    .catch((err) => {response.render('menu', { restaurants: [] });});
};

const cafe_get = (request, response) => {
  const cafeid = request.params.id;
  cafes.findById(cafeid)
    .then((data) => {
      request.session.cafeid = cafeid;
      request.session.cart = [];
      response.render('cafemenuPage', { cafe: data });
    })
    .catch((err) => {response.render('cafemenuPage', { cafe: [] });});
};

const cart_get = (request, response) => {
  const cart = request.session.cart;
  response.render('cart', {cart})
};

const cart_post = (request, response) => {
  const { menuItemId, itemName, itemPrice, itemImg, quantity } = request.body; 
  const cart = request.session.cart
  const existingItem = cart.find(item => item.menuItemId === menuItemId);
  if (existingItem) {
    existingItem.quantity += quantity; // If it exists, increment the quantity
  } else {
    cart.push({ menuItemId,itemName, itemPrice, itemImg, quantity}); // Otherwise, add a new item to the cart with quantity 1
  }
  response.status(200).json({ success: true, cart });
};

const cartRemove_post = (request, response) => {
  const { menuItemId } = request.body;
  request.session.cart = request.session.cart.filter(item => item.menuItemId !== menuItemId);
  response.json({ success: true });
};

const confirmOrder_post = (request, res) => {
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
};

const receipt_get = (request, response) => {
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
};

const userOrders_get = (request, response) => {
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
};

const restaurantDashboard_get = (req, res) => {
  res.render('restaurantLogin');
};

const login_dashboard = async (req, res) => {
  const { password } = req.body;
  try {
    const restaurant = await restaurants.findOne({ password: password });
    if (restaurant) {
      req.session.restaurantId = restaurant._id; // Store restaurant ID in session
      res.redirect(`/restaurant/dashboard/${restaurant._id}`);
    } else {
      res.status(401).send('Invalid password');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal server error');
  }
};

const update_order_status = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId);
    if (order) {
      const statuses = ['Pending', 'Confirmed', 'Preparing', 'Order is Ready'];
      const currentStatusIndex = statuses.indexOf(order.status);
      if (currentStatusIndex < statuses.length - 1) {
        order.status = statuses[currentStatusIndex + 1];
        await order.save();
        res.status(200).send('Order status updated');
      } else {
        res.status(400).send('Order is already in the final status');
      }
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).send('Unable to update order status');
  }
};

const render_dashboard = async (req, res) => {
  const restaurantId = req.params.id;
  try {
    const restaurant = await restaurants.findById(restaurantId);
    const orders = await Order.find({ restaurantId: restaurantId });
    res.render('restaurantDashboard', { orders: orders, restaurant: restaurant });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).send('Unable to retrieve orders.');
  }
};

module.exports = {login_get, login_post, register_post,render_dashboard,login_dashboard,update_order_status,restaurantDashboard_get,
  userOrders_get,receipt_get,restaurantPage_get,cafePage_get,TableReservation_get,TableReservation_post,restaurant_get,cafe_get,
  cart_get,cart_post,cartRemove_post,confirmOrder_post,homePage_get};

