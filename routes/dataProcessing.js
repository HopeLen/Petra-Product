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

router.get("/change-info-table/:orderID/:destination", async (req, res) => {
  const orderID = req.params.orderID;
  const destination = req.params.destination;

  console.log("OrderID: ", orderID);
  console.log("Destination: ", destination);

  let row = await pool
    .query("SELECT `information` FROM `orders` WHERE orderID = ?", orderID)
    .then((res) => res[0])
    .then((res) => res.information);

  console.log(row);
  row.table = destination;
  console.log(row);

  await pool.query("UPDATE `orders` SET `information` = ? WHERE orderID = ?", [
    row,
    orderID,
  ]);

  res.json({ ok: true });
});

router.post(
  "/post-order-to-info/:tableID/:orderID",
  express.json(),
  async (req, res) => {
    const tableID = req.params.tableID;
    const orderID = req.params.orderID;
    const order = req.body;
    console.log("Order id: ", orderID);
    console.log("Order: ", order);

    await pool.query("UPDATE `orders` SET `order` = ? WHERE `orderID` = ?", [
      JSON.stringify(order),
      orderID,
    ]);

    await pool.query(
      "UPDATE `tables` SET `order` = '[]' WHERE `id` = ?",
      tableID
    );

    await pool.query(
      "UPDATE `tables` SET `information` = NULL WHERE `id` = ?",
      tableID
    );

    res.json({ ok: true });
  }
);

router.post("/set-order-status", express.json(), async (req, res) => {
  let conn;
  const { orderID, targetStatus } = req.body;
  if (!orderID || !targetStatus) {
    return res.status(400).json({ error: "Missing orderID or targetStatus" });
  }
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "UPDATE `orders` SET status = ? WHERE orderID = ?",
      [targetStatus, orderID]
    );

    if (targetStatus === "AWAITING") {
      let row = await pool
        .query("SELECT `information` FROM `orders` WHERE orderID = ?", orderID)
        .then((res) => res[0])
        .then((res) => res.information);

      console.log(row);
      row.closeTime = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      row.closeDate = new Date().toLocaleDateString("en-GB");
      console.log(row);

      await pool.query(
        "UPDATE `orders` SET `information` = ? WHERE orderID = ?",
        [row, orderID]
      );
    }

    res.json({ success: true, changedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
