const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { User } = require("../db/userModel");
const {
  RegistrationConflictError,
  LoginAuthError,
  VerificationError,
  BadRequestError,
} = require("../helpers/errors");


const sendRegisterEmail = async({ email, verificationToken }) => {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const url = `localhost:3000/api/users/verify/${verificationToken}`;

  const emailBody = {
    from: "contactInfo@mail.com",
    to: email,
    subject: "Please verify your email",
    html: `<h1> Please open this link: ${url} to verify your email <h1>`,
    text: `Please open this link: ${url} to verify your email`,
  };

  const response = await transport.sendMail(emailBody);
  console.log("Email sent", response);
};

const verifyEmail = async(req, res, next) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({
    verificationToken,
  });

  if (!user) {
    throw new VerificationError("User not found");
  }
  if (!user.verify) {
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    return res.json({
      message: "Verification successful",
    });
  }
    return res.json({
      message: "Your Email already verified",
    });
};

const repeatedVerification = async(req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  const { verificationToken } = user;

  if (!user) {
    throw new VerificationError("User not found");
  }
  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }
  if (user.verify) {
    throw new BadRequestError("Verification has already been passed");
  }
    await sendRegisterEmail({ email, verificationToken });
    res.status(200).json({ message: "Verification email sent" });
};

const signupUser = async (email, password) => {
  if (await User.findOne({ email })) {
    throw new RegistrationConflictError("Email is use");
  }

  const verificationToken = uuidv4();

  const user = new User({
    email,
    password,
    verificationToken,
  });

  try {
    await user.save();
    await sendRegisterEmail({ email, verificationToken });
  } catch (error) {
    if (error.message.includes("duplicate key error collection")) {
      throw new RegistrationConflictError("Email in use");
    }

    throw error;
  }
  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new LoginAuthError("Email or password is wrong");
  }

  if (!user.verify) {
    throw new LoginAuthError("Email is not verified");
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
  verifyEmail,
  repeatedVerification,
};
