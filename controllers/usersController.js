const {
  signupUser,
  loginUser,
  patchSubscriptionUser,
  getCurrentUser,
} = require("../models/users");

const { User } = require('../db/userModel');

const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await signupUser(email, password);
  res.status(201).json({
    status: "success",
    email: user.email,
    subscription: user.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const token = await loginUser(email, password);
  res.status(200).json({ status: "success", token });
};

const patchSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const updatedUser = await patchSubscriptionUser(_id, subscription);
  res.status(200).json({ message: "success", user: updatedUser });
};

const getCurrent = async (req, res) => {
  const { _id } = req.user;
  const user = await getCurrentUser(_id);
  res.status(200).json({ status: "success", user });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null }, { runValidators: true });
  res.status(200).json({ message: 'Success logout' });
};

module.exports = {
  signup,
  login,
  patchSubscription,
  logout,
  getCurrent,
};
