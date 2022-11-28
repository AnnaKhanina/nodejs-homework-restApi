const express = require("express");
const {
  signup,
  login,
  patchSubscription,
  logout,
  getCurrent,
  patchUserAvatar,
} = require("../../controllers/usersController");

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
router.get("/avatars/:avatarId", express.static("./public/avatars"));

router.patch(
  "/avatars",
  authMiddleware,
  uploadAvatarMiddleware.single("avatar"),
  patchUserAvatar
);

module.exports = router;
