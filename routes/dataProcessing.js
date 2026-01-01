const express = require("express");
const router = express.Router();
const pool = require("./mariadb");

router.post("/post-table-info", express.json(), async (req, res) => {
  const data = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO orders (information)
   VALUES (?)`,
      [JSON.stringify(data)]
    );

    pool.query("UPDATE `tables` SET `information` = ? WHERE id = ?", [
      Number(result.insertId),
      data.table,
    ]);

    console.log("Result:", result);
    res.json({
      success: true,
      orderId: Number(result.insertId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
