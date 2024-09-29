const router = require("express").Router();
const { loginLimiter } = require("../middleware");

const { login, isLoggedIn, refresh, logout } = require("../controllers/auth");

const { checkIsLoggedIn } = require("../middleware");

router.route("/").post(checkIsLoggedIn, loginLimiter, login);

router.route("/is-logged-in").get(isLoggedIn);

router.route("/refresh").get(refresh);

router.route("/logout").post(logout);

module.exports = router;
