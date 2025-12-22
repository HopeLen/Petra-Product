const net = require("net");
const EscPosEncoder = require("esc-pos-encoder");

let PRINTER_IP = "";
const PRINTER_PORT = 9100;

const SEPERATOR = "------------------------------------------";

const encoder = new EscPosEncoder({});
let printer = null;

const qrCode =
  "https://search.google.com/local/writereview?placeid=ChIJ_yBzJK2jAhUR0XAWHg8CDxo&source=g.page.m.nr._&utm_source=gbp&laa=nmx-review-solicitation-recommendation-card";

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

function alignLeftRightCenter(left, right, center, lineWidth = 42) {
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

function styleRequest(order) {
  let buffer = encoder
    .codepage("windows1255")
    .bold(true)
    .height(2)
    .width(2)
    .align("center")
    .line(reverseHebrew("פטרה"))
    .bold(false)
    .height(1)
    .width(1)
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

  order.forEach((item) => {
    buffer = buffer.line(
      alignLeftRightCenter(
        reverseHebrew('ש"ח') + " " + String(item.price * item.amount),
        String(item.amount),
        reverseHebrew(item.name),
      ),
    );
    total += item.price * item.amount;
  });

  buffer = buffer
    .line(SEPERATOR)
    .align("right")
    .size("small")
    .line(
      reverseHebrew(' ש"ח') +
        String(total * 1.1 - total) +
        reverseHebrew("שירות(רשות): "),
    )
    .bold(true)
    .line(
      reverseHebrew(' ש"ח') + String(total * 1.1) + reverseHebrew("סך הכל: "),
    )
    .bold(false)
    .newline()
    .newline()
    .align("center")
    .line(reverseHebrew("הנא דרגו את המדסעדה שלנו"))
    .align("center")
    .qrcode(qrCode, 2, 4, "h")
    .encode();

  return buffer;
}

async function print(order, printer, autoClose = true) {
  PRINTER_IP = printer.address;

  const conn = await connectPrinter();

  const buffer = styleRequest(order);

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
