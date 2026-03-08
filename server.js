const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql2/promise");
const PORT = process.env.PORT || 3000;

const menuRoutes = require("./routes/menu");
const tablesRoutes = require("./routes/tables");
const printer = require("./routes/printer");
const dataProcessing = require("./routes/dataProcessing");
const waiterRoutes = require("./routes/waiters");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", tablesRoutes);
app.use("/api", menuRoutes);
app.use("/api", printer);
app.use("/api", waiterRoutes);
app.use("/api", dataProcessing);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
