const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: process.env.DB_HOST, // or your server IP
  port: "3306",
  user: process.env.DB_USER, // MariaDB username
  password: process.env.DB_PASSWORD, // MariaDB password
  database: process.env.DB_NAME, // Your database name
  connectionLimit: 5,
  charset: "utf8mb4", // important for Hebrew support
});

module.exports = pool;
