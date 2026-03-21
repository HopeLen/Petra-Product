const express = require("express");
const router = express.Router();
const pool = require("./mariadb");

router.get("/get-waiter-name/:waiterID", async (req, res) => {
  const waiterID = req.params.waiterID;
  const name = await pool.query(
    "SELECT name FROM users WHERE id = ?",
    waiterID,
  );
  console.log(name);
  res.json(name);
});

router.get("/get-admin-privileges/:waiterID", async (req, res) => {
  const waiterID = req.params.waiterID;
  const admin = await pool.query(
    "SELECT admin FROM users WHERE id = ?",
    waiterID,
  );
  console.log(admin);
  res.json(admin);
});

router.get("/get-waiters", express.json(), async (req, res) => {
  try {
    const waiters = await pool.query("SELECT * FROM users");
    console.log(waiters);
    res.json(waiters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/patch-waiter", express.json(), async (req, res) => {
  waiter = req.body;
  console.log(waiter);

  pool.query("UPDATE users SET name=?, admin=? WHERE id=?", [
    waiter.name,
    waiter.admin,
    waiter.id,
  ]);
});

router.post("/post-waiter", express.json(), async (req, res) => {
  try {
    const { name, admin } = req.body;

    const sql = `
      INSERT INTO users (name, admin)
      VALUES (?, ?)
    `;

    const result = await pool.execute(sql, [name, admin]);

    return res.status(201).json({
      message: "Waiter created successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
