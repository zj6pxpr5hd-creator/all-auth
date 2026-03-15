const express = require('express');
const cors = require('cors');
const pool = require("./db/db");

const app = express();

//Middleware
app.use(express.json());
app.use(cors());

//my routes

//TEST Routes
app.get('/', (req, res) => {
    res.json({message: "API working"});
});

module.exports = app;