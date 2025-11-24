const express = require("express");
const mariadb = require("mariadb");
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mariadb.createPool({
  host: "127.0.0.1", // or your server IP
  port: "3306",
  user: "root", // MariaDB username
  password: "root", // MariaDB password
  database: "petra_test", // Your database name
  connectionLimit: 5,
  charset: "utf8mb4", // important for Hebrew support
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/get-tables-from-section/:sectionId", async (req, res) => {
  let conn;
  try {
    const sectionId = Number(req.params.sectionId);
    conn = await pool.getConnection();

    const rows = await conn.query(
      "SELECT id, status FROM `tables` WHERE section_id = ?",
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

app.post("/api/set-table-status", async (req, res) => {
  let conn;
  const { tableID, targetStatus } = req.body;
  if (!tableID || !targetStatus) {
    return res.status(400).json({ error: "Missing tableID or targetStatus" });
  }
  try {
    conn = await pool.getConnection();
    console.log(tableID, targetStatus);

    const result = await conn.query(
      "UPDATE tables SET status = ? WHERE id = ?",
      [targetStatus, tableID]
    );

    res.json({ success: true, changedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.get("/api/get-table-sections", async (req, res) => {
  try {
    const rows = await pool.query("SELECT DISTINCT section_id FROM tables");
    console.log("Query result:", rows);

    // rows is already an array of objects
    const sectionIds = rows.map((r) => Number(r.section_id));

    console.log("Section IDs to send:", sectionIds);

    res.json({
      uniqueSectionCount: sectionIds.length,
      sectionIds,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/get-table-order/:tableID", async (req, res) => {
  const tableID = req.params.tableID;
  console.log(tableID);
  try {
    const [order] = await pool.query(
      "SELECT `order` FROM tables WHERE id = ?",
      [tableID]
    );

    //console.log("Query result:", order);
    res.json(order);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});

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

app.post(`/api/get-items`, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { order } = req.body;
    console.log(order);
    const ids = order.order.map((item) => item.itemID);
    console.log(ids);
    if (ids.length === 0) {
      return res.json([]);
    }
    const placeholders = ids.map(() => "?").join(",");
    const query = `
      SELECT id, name, price
      FROM menu
      WHERE id IN (${placeholders})
    `;
    const rows = await conn.execute(query, ids);
    console.log(rows);
    console.log(Array.isArray(rows));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
