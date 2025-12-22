const express = require("express");
const router = express.Router();
const pool = require("./mariadb");

const escpos = require("escpos");
escpos.Network = require("escpos-network");

const EscPosEncoder = require("esc-pos-encoder");

const { print, reverseHebrew, alignLeftRight } = require("./print");

router.get("/get-printer-names-TEST", async (req, res) => {
  res.json(require("../assets/printers/printer-maps.json"));
});

router.post("/post-print-request", async (req, res) => {
  const request = req.body;
  console.log(request);
  print(request);
});

module.exports = router;
