const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
} = require("./../controller/user.Controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedIn, getProfile);
router.post("/reset", forgotPassword);
router.post("/reset/:resetToken", resetPassword);
router.post("/changePassword", isLoggedIn,changePassword);
router.post("/update", isLoggedIn, upload.single("avatar"), updateUser);

module.exports = router;
