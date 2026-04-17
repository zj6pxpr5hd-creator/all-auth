const express = require('express');
const cors = require('cors');
const pool = require("./db/db");
const authRoutes = require("../src/routes/AuthRoutes.js")
const cookieParser = require("cookie-parser")

const app = express();

//Middleware
app.use(express.json());

const allowedOrigins = (process.env.ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const isDev = process.env.NODE_ENV !== 'production';
const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const privateIpRegex = /^https?:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/;

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        if (isDev && (localhostRegex.test(origin) || privateIpRegex.test(origin))) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

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
