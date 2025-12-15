const express = require("express");
const router = express.Router();
const pool = require("./mariadb");

const escpos = require('escpos');
escpos.Network = require('escpos-network');
const net = require('net');

// Get tables from a section
router.get("/get-tables-from-section/:sectionId", async (req, res) => {
  let conn;
  try {
    const sectionId = Number(req.params.sectionId);
    conn = await pool.getConnection();

    const rows = await conn.query(
      "SELECT id, location, status, shape FROM `tables` WHERE section_id = ?",
      [sectionId]
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

// Get table sections
router.get("/get-table-sections", async (req, res) => {
  try {
    const rows = await pool.query(
      "SELECT DISTINCT section_id FROM tables ORDER BY section_id ASC"
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
      [tableID]
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

  console.log("This is the order:");
  console.log(orderArray);
  console.log(tableID);
  try {
    await pool.query(sql, [JSON.stringify(orderArray), tableID]);
    console.log("success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

  res.send({ ok: true });
});

router.get("/get-table-section-map", async (req, res) => {
  res.json(require("../assets/maps/table-section-map.json"));
});

router.get("/get-bill-options", async (req, res) => {
  res.json(require("../assets/maps/bill-popup.json"));
});

router.post("/post-print-request", async (req, res) => {
  console.log("The printing will be here");
});

router.post("/post-bill-print-request/:tableID", async (req, res) => {
  const tableID = req.params.tableID;
  console.log("Bill printing will be here. Also " + tableID);

const PRINTER_IP = '192.168.10.59';
const PRINTER_PORT = 9100;

const client = new net.Socket();

client.connect(PRINTER_PORT, PRINTER_IP, () => {
  console.log('Connected to printer');

  // ESC/POS command + text + cut
  const data = Buffer.from([
    0x1B, 0x40,              // Initialize printer
    ...Buffer.from("We are Charlie Kirk!\nWe carry the flame!\n\n\n\n\n\n\n\n\n\n\n\n\n\n"), // Text
    0x0A,                     // Line feed
    0x1D, 0x56, 0x41          // Full cut
  ]);

  client.write(data);  // Send to printer
  client.end();        // Close connection
});

client.on('error', (err) => {
  console.error('Printer connection error:', err);
});


});

module.exports = router;
