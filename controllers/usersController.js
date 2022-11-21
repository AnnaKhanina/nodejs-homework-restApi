const {
  signupUser,
  loginUser,
  logoutUser,
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

// const logout = async (req, res) => {
//   const { _id } = req.user;
//   await User.findByIdAndUpdate(_id, { token: null }, { runValidators: true });
//   res.status(200).json({ message: 'Success logout' });
// };

const logout = async (req, res) => {
  const { id } = req.user;
  const token = req.token;
  await logoutUser({
    id,
    token
  });
  res.status(204).json({});
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
  logout,
  getCurrent,
};
