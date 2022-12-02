const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
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
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { subscription },
    { runValidators: true, new: true }
  ).select({ email: 1, subscription: 1, _id: 0 });
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

const uploadUserAvatar = async(req, res, next) => {
  const { user } = req;
  const { filename } = req.file;
  const avatarURL = `/avatars/${filename}`;
  const newPath = path.join(__dirname, "../public/avatars", req.file.filename);
  await fs.rename(req.file.path, newPath);
  Jimp.read(newPath, (err, avatar) => {
    if (err) throw err;
    avatar.resize(250, 250).quality(60).greyscale().write(newPath);
  });

  const updatedAvatar = await User.findByIdAndUpdate(
    user._id,
    {
      avatarURL,
    },
    { new: true }
  ).select({ avatarURL: 1, _id: 0 });

  return res.status(200).json({ status: "success", updatedAvatar });
};

module.exports = {
  signupUser,
  loginUser,
  patchSubscriptionUser,
  getCurrentUser,
  uploadUserAvatar,
};
