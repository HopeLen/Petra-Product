const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "127.0.0.1", // or your server IP
  port: "3306",
  user: "root", // MariaDB username
  password: "root", // MariaDB password
  database: "petra_test", // Your database name
  connectionLimit: 5,
  charset: "utf8mb4", // important for Hebrew support
});

module.exports = pool;
