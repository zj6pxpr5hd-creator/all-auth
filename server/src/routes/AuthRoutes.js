//define register route
const express = require("express");
const router = express.Router(); //creates a Router (connects endpoint with controller functions)

const { register } = require("../controllers/RegisterController") //imports register function
const { authenticate } = require("../controllers/AuthController")
const { logout } = require("../controllers/LogoutController")
const { login } = require("../controllers/LoginController")

router.post("/register", register); //defines register route

router.post("/login", login);  // defines login route

router.get("/authenticate", authenticate); // defines authenticate route

router.post("/logout", logout);  // defines logout route

module.exports = router;