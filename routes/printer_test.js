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

router.post("/post-print-request-test", async (req, res) => {
  const printer = req.body;
  console.log("The printer is:", printer);

  const order = [
    {
      price: 40,
      id: 53,
      name: "ווינשטפן 0.5",
      extra: {
        variations: 1,
        comment: "",
      },
      amount: 1,
    },
    {
      price: 34,
      id: 53,
      name: "ווינשטפן 0.3",
      extra: {
        variations: 0,
        comment: "",
      },
      amount: 2,
    },
    {
      id: 3,
      name: "תפוח אדמה עלומה",
      amount: 1,
      price: 74,
      extra: null,
    },
    {
      id: 48,
      name: "סליאנקה כבדים",
      amount: 1,
      price: 84,
      extra: null,
    },
    {
      id: 5,
      name: "בליני חלבי",
      amount: 2,
      price: 58,
      extra: null,
    },
    {
      id: 26,
      name: "מרק בורשט",
      amount: 1,
      price: 66,
      extra: null,
    },
    {
      id: 13,
      name: "פטה כבד עוף",
      amount: 3,
      price: 54,
      extra: null,
    },
  ];

  const type = "bill";

  console.log("Printing the buffer:");
  await print(order, printer, type);
});

module.exports = router;
