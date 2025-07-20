const { Router } = require("express");
const router = Router();
const auth = require("../MiddleWares/auth");

const { login, sign, logout } = require("../Controllers");
router
  .post("/signup", sign)
  .post("/login", login)
  .post("/logout", auth, logout);
module.exports = router;
