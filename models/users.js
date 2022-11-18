const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../db/userModel");
const {
  RegistrationConflictError,
  LoginAuthError,
} = require("../helpers/errors");

const signupUser = async (email, password) => {
  if (await User.findOne({ email })) {
    throw new RegistrationConflictError("Email is use");
  }

  const user = new User({
    email,
    password,
  });

  await user.save();
  return user;
};
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new LoginAuthError("Email or password is wrong");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new LoginAuthError("Email or password is wrong");
  }

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  await User.findByIdAndUpdate(user._id, { token }, { runValidators: true });

  return token;
};

const patchSubscriptionUser = async (id, subscription) => {
  await User.findByIdAndUpdate(id, { subscription }, { runValidators: true });
  const updatedUser = await User.findById(id).select({
    email: 1,
    subscription: 1,
    _id: 0,
  });
  return updatedUser;
};

const getCurrentUser = async (id) => {
  const data = await User.findById(id).select({
    email: 1,
    subscription: 1,
    _id: 0,
  });
  return data;
};

module.exports = {
  signupUser,
  loginUser,
  patchSubscriptionUser,
  getCurrentUser,
};
