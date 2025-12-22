const net = require("net");
const EscPosEncoder = require("esc-pos-encoder");

const pool = require("./mariadb");
const translation = require("../assets/maps/translation-map.json");
const { info } = require("console");

let PRINTER_IP = "";
const PRINTER_PORT = 9100;

const SEPERATOR = "------------------------------------------";

const encoder = new EscPosEncoder({});
let printer = null;

const qrCode =
  "https://search.google.com/local/writereview?placeid=ChIJ_yBzJK2jAhUR0XAWHg8CDxo&source=g.page.m.nr._&utm_source=gbp&laa=nmx-review-solicitation-recommendation-card";

async function getItem(id) {
  try {
    const rows = await pool.query("SELECT * FROM menu WHERE id = ?", id);
    console.log(rows);
    return rows;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function getWaiter(id) {
  try {
    const rows = await pool.query("SELECT name FROM users WHERE id = ?", id);
    console.log(rows);
    return rows;
  } catch (err) {
    console.error(err);
    return err;
  }
}

function connectPrinter() {
  if (printer) return printer;

  printer = net.createConnection(PRINTER_PORT, PRINTER_IP);

  printer.on("connect", () => {
    console.log("🖨️ Printer connected");
  });

  printer.on("error", (err) => {
    console.error("Printer error:", err);
    printer = null;
  });

  printer.on("close", () => {
    console.log("Printer connection closed");
    printer = null;
  });

  return printer;
}

function closePrinter() {
  if (printer) {
    printer.end(() => {
      console.log("🖨️ Printer connection closed manually");
      printer = null;
    });
  }
}

function reverseHebrew(str) {
  // Split into words
  const words = str.split(" ");

  // Reverse the characters in Hebrew words
  const reversedWords = words.map((word) => {
    if (/[\u0590-\u05FF]/.test(word)) {
      return word.split("").reverse().join("");
    }
    return word;
  });

  // Reverse the order of all words for proper sentence direction
  return reversedWords.reverse().join(" ");
}

function alignLeftRightCenter(
  left = " ",
  right = " ",
  center = " ",
  lineWidth = 42,
) {
  const leftLen = [...left].length;
  const centerLen = [...center].length;
  const rightLen = [...right].length;

  const remaining = lineWidth - leftLen - centerLen - rightLen;

  if (remaining < 2) {
    // Fallback if text is too long
    return left + center + right;
  }

  const spaceLeft = Math.floor(remaining / 2);
  const spaceRight = remaining - spaceLeft;

  return left + " ".repeat(spaceLeft) + center + " ".repeat(spaceRight) + right;
}

function styleRequestBill(order) {
  console.log(order);

  let buffer = encoder
    //codepage:
    .codepage("windows1255")
    //PETRA name start:
    .bold(true)
    .height(2)
    .width(2)
    .align("center")
    .line(reverseHebrew("פטרה"))
    .bold(false)
    .height(1)
    .width(1)
    //PETRA name end

    //Content start:
    .align("left")
    .line(SEPERATOR)
    .line(
      alignLeftRightCenter(
        reverseHebrew("מחיר"),
        reverseHebrew("כמות"),
        reverseHebrew("פריט"),
      ),
    );
  let total = 0;

  order.items.order.forEach(async (item) => {
    buffer = buffer.line(
      alignLeftRightCenter(
        reverseHebrew('ש"ח') + " " + String(item.price * item.amount),
        String(item.amount),
        reverseHebrew(item.name),
      ),
    );

    if (item.extra) {
      const infoItem = await getItem(item.id);
      console.log(infoItem);
      buffer = buffer.align("right");
      Object.keys(item.extra).forEach((key) => {
        console.log(key);
        if (
          key != "variations" &&
          key != "comment" &&
          infoItem.extra[key].type == "radio"
        ) {
          buffer = buffer.line(
            reverseHebrew(
              " " +
                translation[key] +
                ": " +
                infoItem.extra[key].items[item.extra[key]],
            ),
          );
        }
        if (
          key != "variations" &&
          key != "comment" &&
          infoItem.extra[key].type == "checkbox"
        ) {
          buffer = buffer.line(reverseHebrew(translation[key] + ": "));
          item.extra[key].forEach((num) => {
            buffer = buffer.line(
              reverseHebrew("  " + infoItem.extra[key][num]),
            );
          });
        }
      });
    }

    total += item.price * item.amount;
  });
  //Content end

  buffer = buffer
    .line(SEPERATOR)
    .align("right")
    .line(
      reverseHebrew(' ש"ח') +
        String(Math.ceil(total * order.percent - total)) +
        reverseHebrew("שירות: "),
    )
    .bold(true)
    .line(
      reverseHebrew(' ש"ח') +
        String(Math.ceil(total * order.percent)) +
        reverseHebrew("סך הכל: "),
    )
    .bold(false)
    .newline()
    .newline()
    .align("center")
    .line(reverseHebrew("הנא דרגו את המסעדה שלנו"))
    .align("center")
    .qrcode(qrCode, 2, 4, "h");

  return buffer.encode();
}

async function processRequest(order) {
  if (order.type == "bill") {
    let buffer = styleRequestBill(order);
    console.log(buffer);
    return buffer;
  } else {
    buffer = styleRequestBon(order);
  }
  return buffer;
}

async function print(order, autoClose = true) {
  let buffer = await processRequest(order);

  PRINTER_IP = "192.168.10.59";

  const conn = await connectPrinter();
  conn.write(buffer);

  let outerEncoder = encoder.initialize();

  for (i = 0; i < 7 * 1; i++) {
    outerEncoder = outerEncoder.newline();
  }
  const outer = outerEncoder.cut("partial").encode();

  conn.write(outer, async () => {
    if (autoClose) {
      closePrinter();
    }
  });
}

module.exports = { print, reverseHebrew, alignLeftRightCenter };
