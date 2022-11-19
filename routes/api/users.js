const express = require("express");
const {
  signup,
  login,
  patchSubscription,
  getCurrent,
} = require("../../controllers/usersController");

const { tryCatchWrapper } = require("../../helpers/index");
const {
  loginValidation,
} = require("../../validationMiddleware/loginValidation");
const {
  logoutMiddleware,
} = require("../../validationMiddleware/logoutMiddleware");
const { authMiddleware } = require("../../validationMiddleware/authMiddleware");

const router = express.Router();

router.post("/signup", loginValidation, tryCatchWrapper(signup));
router.post("/login", loginValidation, tryCatchWrapper(login));
router.get("/logout", tryCatchWrapper(logoutMiddleware));
router.get("/current", authMiddleware, tryCatchWrapper(getCurrent));
router.patch("/", authMiddleware, tryCatchWrapper(patchSubscription));

module.exports = router;
