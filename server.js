const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql2/promise");

const menuRoutes = require("./routes/menu");
const tablesRoutes = require("./routes/tables");

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", tablesRoutes);
app.use("/api", menuRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
