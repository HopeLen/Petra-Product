const express = require("express");
const router = express.Router();
const pool = require("./mariadb");

const escpos = require("escpos");
escpos.Network = require("escpos-network");

const EscPosEncoder = require("esc-pos-encoder");

const {
  print,
  reverseHebrew,
  alignLeftRight,
  printQR,
} = require("../helpers/print");

router.get("/get-all-printers", async (req, res) => {
  const rows = await pool.query("SELECT * FROM printers");
  console.log(rows);
  res.json(rows);
});

router.get("/get-items-printers/:id", async (req, res) => {
  const id = req.params.id;

  const [printers] = await pool.query(
    "SELECT printers FROM menu WHERE id=?",
    id
  );
  console.log(printers);
  res.json(printers);
});

router.post("/post-print-request", async (req, res) => {
  const request = req.body;
  await print(request);
  res.json({ ok: true });
});

router.get("/send-qr-print", async (req, res) => {
  console.log("arrived");

  await printQR();

  res.json({ ok: true });
});

module.exports = router;
