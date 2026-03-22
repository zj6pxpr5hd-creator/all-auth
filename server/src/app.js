const express = require('express');
const cors = require('cors');
const pool = require("./db/db");
const authRoutes = require("../src/routes/AuthRoutes.js")
const cookieParser = require("cookie-parser")

const app = express();

//Middleware
app.use(express.json());
app.use(cors({origin: process.env.ORIGIN, credentials: true}));
app.use(cookieParser())

//my routes
app.use("/api/auth/", authRoutes)


//TEST Routes
app.get('/', (req, res) => {
    res.json({message: "API working"});
});

app.get('/test-db', async (req, res) => {
    try{
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    }catch (err){
        console.error(err);
        res.status(500).json({ error: 'database error '});
    }
})

module.exports = app;