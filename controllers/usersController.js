const {
  signupUser,
  loginUser,
  patchSubscriptionUser,
  getCurrentUser,
} = require("../models/users");

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

module.exports = {
  signup,
  login,
  patchSubscription,
  getCurrent,
};
