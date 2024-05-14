const bcrypt = require("bcryptjs");

const User = require("../model/user");
const Restaurant = require('../model/menu');
const Order = require('../model/order');

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

const login_dashboard = async (req, res) => {
  const { password } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ password: password });
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
      // Update order status
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
    const restaurant = await Restaurant.findById(restaurantId);
    const orders = await Order.find({ restaurantId: restaurantId });
    res.render('restaurantDashboard', { orders: orders, restaurant: restaurant });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).send('Unable to retrieve orders.');
  }
};

module.exports = {login_get, login_post, register_post,render_dashboard,login_dashboard,update_order_status};