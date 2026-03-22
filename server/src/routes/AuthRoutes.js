//define register route
const express = require("express");
const router = express.Router(); //creates a Router (connects endpoint with controller functions)

const { register } = require("../controllers/RegisterController") //imports register function
const { authenticate } = require("../controllers/AuthController")

router.post("/register", register); //defines register route

router.get("/authenticate", authenticate); // defines authenticate route

module.exports = router;