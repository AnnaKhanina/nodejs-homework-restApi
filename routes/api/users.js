const express = require("express");
const {
  signup,
  login,
  patchSubscription,
  logout,
  getCurrent,
  } = require("../../controllers/usersController");

const {uploadUserAvatar} = require("../../models/users");

const { tryCatchWrapper } = require("../../helpers/index");
const {
  loginValidation,
} = require("../../validationMiddleware/loginValidation");
const { authMiddleware } = require("../../validationMiddleware/authMiddleware");
const {
  uploadAvatarMiddleware,
} = require("../../validationMiddleware/uploadAvatarMiddleware");

const router = express.Router();

router.post("/signup", loginValidation, tryCatchWrapper(signup));
router.post("/login", loginValidation, tryCatchWrapper(login));
router.get("/logout", authMiddleware, tryCatchWrapper(logout));
router.get("/current", authMiddleware, tryCatchWrapper(getCurrent));
router.patch("/", authMiddleware, tryCatchWrapper(patchSubscription));

router.patch(
  "/avatars",
  authMiddleware,
  uploadAvatarMiddleware.single("avatar"),
  tryCatchWrapper(uploadUserAvatar)
);

module.exports = router;
