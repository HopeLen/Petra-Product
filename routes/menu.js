const express = require("express");
const router = express.Router();
const pool = require("./mariadb");

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

router.get("/get-KITCHEN-menu-map", (req, res) => {
  res.json(require("../assets/maps/kitchen-menu-section-map.json"));
});

router.get("/get-BAR-menu-map", (req, res) => {
  res.json(require("../assets/maps/bar-menu-section-map.json"));
});

router.get("/get-menu-sections-KITCHEN", async (req, res) => {
  try {
    const rows = await pool.query(
      "SELECT DISTINCT section_id FROM menu WHERE type = 'KITCHEN' ORDER BY section_id ASC"
    );

    const sectionIds = rows.map((r) => Number(r.section_id));
    res.json({
      uniqueSectionCount: sectionIds.length,
      sectionIds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-menu-sections-BAR", async (req, res) => {
  try {
    const rows = await pool.query(
      "SELECT DISTINCT section_id FROM menu WHERE type = 'BAR' ORDER BY section_id ASC"
    );

    const sectionIds = rows.map((r) => Number(r.section_id));
    res.json({
      uniqueSectionCount: sectionIds.length,
      sectionIds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-menu-section/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const rows = await pool.query(
      "SELECT name,price,extra FROM menu WHERE section_id=?",
      [id]
    );
    console.log(rows);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
