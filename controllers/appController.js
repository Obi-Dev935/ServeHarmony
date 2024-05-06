const bcrypt = require("bcryptjs");

const User = require("../model/user");

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
  req.session.username = user.username;
  res.redirect("/dashboard");
};

const register_post = async (req, res) => {
  const { phoneNumber, password } = req.body;
  let user = await User.findOne({ phoneNumber: phoneNumber });

  if (user) {
    req.session.error = "User already exists";
    return res.redirect("/register");
  }

  const hashPsw = await bcrypt.hash(password, 12);
  user = new User({
    phoneNumber: phoneNumber,
    password: hashPsw,
  });

  await user.save();
  res.redirect("/login");
};

module.exports = {login_get, login_post, register_post};