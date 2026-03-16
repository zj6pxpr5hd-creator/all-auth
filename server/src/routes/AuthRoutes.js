//define register route
const express = require("express");
const router = express.Router(); //creates a Router (connects endpoint with controller functions)

const { register } = require("../controllers/RegisterController") //imports register function

router.post("/register", register); //defines register route


module.exports = router;