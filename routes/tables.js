const express = require("express");
const router = express.Router();
const pool = require("./mariadb");

// Get tables from a section
router.get("/get-tables-from-section/:sectionId", async (req, res) => {
  let conn;
  try {
    const sectionId = Number(req.params.sectionId);
    conn = await pool.getConnection();

    const rows = await conn.query(
      "SELECT id, location, status, shape, section_id FROM `tables` WHERE section_id = ?",
      [sectionId],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Set table status
router.post("/set-table-status", async (req, res) => {
  let conn;
  const { tableID, targetStatus } = req.body;
  if (!tableID || !targetStatus) {
    return res.status(400).json({ error: "Missing tableID or targetStatus" });
  }
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "UPDATE tables SET status = ? WHERE id = ?",
      [targetStatus, tableID],
    );

    res.json({ success: true, changedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Get table sections
router.get("/get-table-sections", async (req, res) => {
  try {
    const rows = await pool.query(
      "SELECT DISTINCT section_id FROM tables ORDER BY section_id ASC",
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

// Get table order
router.get("/get-table-order/:tableID", async (req, res) => {
  const tableID = req.params.tableID;
  try {
    const [order] = await pool.query(
      "SELECT `order` FROM tables WHERE id = ?",
      [tableID],
    );
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/post-order/:tableID", express.json(), async (req, res) => {
  const tableID = req.params.tableID;
  const orderArray = req.body;

  const sql = `
    UPDATE tables
    SET \`order\` = ?
    WHERE id = ?
  `;

  try {
    const result = await pool.query(sql, [JSON.stringify(orderArray), tableID]);
    console.log(result);
    // 🚨 Table does not exist
    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        error: "Table not found",
      });
    }

    // ✅ Success
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-table-section-map", async (req, res) => {
  const sections = await pool.query("SELECT * FROM sections");
  console.log(sections);

  res.json(sections);
});

router.get("/get-bill-options", async (req, res) => {
  res.json(require("../assets/maps/bill-popup.json"));
});

router.get("/nullify-order/:tableID", async (req, res) => {
  const tableID = req.params.tableID;

  pool.query("UPDATE `tables` SET `order` = '[]' WHERE id = ?", tableID);
  pool.query("UPDATE `tables` SET `information` = NULL WHERE id = ?", tableID);
});

router.get("/get-order-id/:tableID", async (req, res) => {
  const tableID = req.params.tableID;

  const result = await pool.query(
    "SELECT `information` FROM `tables` WHERE id = ?",
    tableID,
  );

  res.json(result);
});

router.get("/get-table-status/:tableID", async (req, res) => {
  const tableID = req.params.tableID;

  const status = await pool
    .query("SELECT `status` FROM `tables` WHERE id = ?", tableID)
    .then((res) => res[0].status);

  console.log(status);
  res.json(status);
});

router.delete("/delete-table/:tableID", express.json(), async (req, res) => {
  const tableID = req.params.tableID;

  pool.query("DELETE FROM `tables` WHERE id=?", tableID);

  res.json({ message: "Table deleted successfully" });
});

router.post("/add-table", express.json(), async (req, res) => {
  const { id, section_id, location, shape } = req.body;

  console.log(id, section_id, location, shape);

  if (!section_id || !location || !shape) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = `
        INSERT INTO tables (id, section_id, location, shape)
        VALUES (?, ?, ?, ?)
    `;

  pool.query(sql, [id, section_id, location, shape], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      success: true,
      id: result.insertId,
    });
  });
});

module.exports = router;
