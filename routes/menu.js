const express = require('express');
const router = express.Router();
const pool = require('./mariadb');

// Get items from order
router.post("/get-items", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { order } = req.body;

    const ids = order.order.map((item) => item.itemID);
    if (ids.length === 0) return res.json([]);

    const placeholders = ids.map(() => "?").join(",");
    const query = `SELECT id, name, price FROM menu WHERE id IN (${placeholders})`;

    const rows = await conn.execute(query, ids);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
