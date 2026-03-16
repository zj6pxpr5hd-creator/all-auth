require("dotenv").config();

const validateEnv = require("./src/config/validateEnv.js")

validateEnv();

const app = require("./src/app.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})