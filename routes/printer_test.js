const express = require("express");
const router = express.Router();
const pool = require("./mariadb");

const escpos = require("escpos");
escpos.Network = require("escpos-network");

const EscPosEncoder = require("esc-pos-encoder");

const { print } = require("./print");

router.get("/get-printer-names-TEST", async (req, res) => {
  res.json(require("../assets/printers/printer-maps.json"));
});

router.post("/post-print-request-test", async (req, res) => {
  console.log("The printer is:", req.body);

  const encoder = new EscPosEncoder();

  const buffer = encoder
    .initialize()
    .codepage("cp862")
    .text("זה עבד!!")
    .newline()
    .newline()
    .newline()
    .cut("partial")
    .encode();

  console.log(buffer);

  print(buffer);
});

module.exports = router;
