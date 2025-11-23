// Modules
const express = require("express");
const mariadb = require("mariadb");
const path = require("path");
const mysql = require("mysql2/promise");
const multer = require("multer")
const printers = require("./printers/printer")
const { buildOrderReceipt, printToPrinter } = require("./printers/printService");

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

// Database connection
const pool = mariadb.createPool({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "root",
  database: "petra_test",
  connectionLimit: 5,
  charset: "utf8mb4"
});

// Fetches all tables with a specific section ID
app.get("/api/get-tables-section/:sectionId", async (req, res) => {
  let conn;
  try {
    const sectionId = Number(req.params.sectionId);
    conn = await pool.getConnection();

    const rows = await conn.query(
      "SELECT * FROM `tables` WHERE section_id = ?",
      [sectionId]
    );

    console.log(rows);
    console.log("Row count:", rows.length);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Fetches all unique table section IDs and their amount
app.get("/api/get-table-sections", async (req, res) => {
  try {
    const rows = await pool.query("SELECT DISTINCT section_id FROM tables");
    console.log("Query result:", rows);

    // rows is already an array of objects
    const sectionIds = rows.map(r => Number(r.section_id));

    console.log("Section IDs to send:", sectionIds);

    res.json({
      uniqueSectionCount: sectionIds.length,
      sectionIds
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Manunal database connection test [DELETE LATER]
app.get("/test-db", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT NOW() AS now");
    res.send(`Database connected! Current time: ${rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.send("Database connection failed: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});



app.post("/api/print-order", async (req, res) => {
  try {
    const { printerId, tableId, items } = req.body;

    const printer = printers.find(p => p.id === printerId);
    if (!printer) return res.status(404).json({ error: "Printer not found" });

    const time = new Date().toLocaleString();
    const receipt = buildOrderReceipt({ tableId, items, time });

    await printToPrinter(printer, receipt);

    res.json({ success: true, message: "Print sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Printing failed", details: err.message });
  }
});


// Server creation
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
