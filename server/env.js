const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  database_url: process.env.DATABASE_URL,
  jwt_key: process.env.KEY
};
