const express = require("express");
const router = express.Router();
const pool = require("./mariadb");

router.get("/get-waiter-name/:waiterID", async (req, res) => {
  const waiterID = req.params.waiterID;
  const name = await pool.query(
    "SELECT name FROM users WHERE id = ?",
    waiterID
  );
  console.log(name);
  res.json(name);
});

module.exports = router;
