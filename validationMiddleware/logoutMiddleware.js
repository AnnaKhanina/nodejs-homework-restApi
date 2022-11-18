const jwt = require("jsonwebtoken");

const { LoginAuthError } = require("../helpers/errors");
const { User } = require("../db/userModel");

const logoutMiddleware = async (req, res, next) => {
  const [, token] = req.headers["authorization"].split(" ");

  if (!token) {
    next(new LoginAuthError("Not authorized"));
  }
  try {
    const user = jwt.decode(token, process.env.JWT_SECRET);
    const auditUser = await User.findById(user._id);

    if (!auditUser || token !== auditUser.token) {
      throw new LoginAuthError("Not authorized");
    }

    await User.findByIdAndUpdate(
      user._id,
      { token: null },
      { runValidators: true }
    );

    res.status(200).json({ message: "Success logout" });
  } catch (err) {
    throw new LoginAuthError("Not authorized");
  }
};

module.exports = {
  logoutMiddleware,
};
