require("dotenv").config();

//checks if JWT secrets have been initialized
function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing env var: ${name}`);
  }
}

requireEnv("JWT_ACCESS_SECRET");
requireEnv("JWT_REFRESH_SECRET");
//

const app = require("./src/app.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})