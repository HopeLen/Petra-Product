const net = require("net");
const EscPosEncoder = require("esc-pos-encoder");

const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

const pool = require("../routes/mariadb");
const translation = require("../assets/maps/translation-map.json");

const PRINTER_PORT = 9100;

const SEPERATOR = "------------------------------------------";

const centerRightGap = 4; // 👈 how close center is to right

const encoder = new EscPosEncoder({});
let printer = null;

const qrCode =
  "https://search.google.com/local/writereview?placeid=ChIJ_yBzJK2jAhUR0XAWHg8CDxo&source=g.page.m.nr._&utm_source=gbp&laa=nmx-review-solicitation-recommendation-card";

async function getItem(id) {
  try {
    const rows = await pool.query("SELECT * FROM menu WHERE id = ?", id);
    return rows;
  } catch (err) {
    console.error(err);
    return err;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getWaiter(id) {
  try {
    const rows = await pool.query("SELECT name FROM users WHERE id = ?", id);
    console.log(rows);
    return rows[0].name;
  } catch (err) {
    console.error(err);
    return err;
  }
}

// Store connections per IP
const printers = new Map();

async function connectPrinter(ip) {
  // Return existing connection if still alive
  if (printers.has(ip)) {
    const conn = printers.get(ip);
    if (!conn.destroyed) return conn;
  }

  return new Promise((resolve, reject) => {
    const conn = net.createConnection(PRINTER_PORT, ip, () => {
      console.log("🖨️ Printer connected:", ip);
      printers.set(ip, conn);
      resolve(conn);
    });

    conn.on("error", (err) => {
      console.error("Printer error:", err);
      printers.delete(ip);
      reject(err);
    });

    conn.on("close", () => {
      console.log("Printer connection closed:", ip);
      printers.delete(ip);
    });
  });
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

  const remaining = lineWidth - leftLen - centerLen - rightLen - centerRightGap;

  if (remaining < 1) {
    return left + center + " ".repeat(centerRightGap) + right;
  }

  return (
    left + " ".repeat(remaining) + center + " ".repeat(centerRightGap) + right
  );
}

async function styleRequestBill(order) {
  console.log(order);
  const waiter = await getWaiter(order.waiterID);
  console.log(waiter);
  console.log(order.tableID);
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

    //Header start:
    .align("right")
    .line(reverseHebrew("מספר שולחן: " + order.tableID))
    .line(reverseHebrew("מלצר מטפל: " + waiter))
    //.line FOR ORDER NUMBER TO DO
    .align("left")

    //Header end

    //Content start:
    .align("left")
    .bold(true)
    .line(SEPERATOR)
    .bold(false)
    .line(
      alignLeftRightCenter(
        reverseHebrew("מחיר"),
        reverseHebrew("כמות"),
        reverseHebrew("פריט"),
      ),
    );
  let total = 0;

  for (const item of order.items.order) {
    buffer = buffer.line(
      alignLeftRightCenter(
        reverseHebrew('ש"ח') + " " + String(item.price * item.amount),
        String(item.amount),
        reverseHebrew(item.name),
      ),
    );

    if (item.extra) {
      const infoItem = (await getItem(item.id))[0];
      buffer = buffer.align("right");
      for (const key of Object.keys(infoItem.extra)) {
        if (
          key !== "variations" &&
          key !== "comment" &&
          infoItem.extra[key].type === "radio"
        ) {
          buffer = buffer.line(
            reverseHebrew(
              " ".repeat(centerRightGap + 2) +
                `${translation[key]}: ${
                  infoItem.extra[key].items[item.extra[key]]?.name ?? ""
                }`,
            ),
          );
        }

        if (
          key !== "variations" &&
          key !== "comment" &&
          infoItem.extra[key].type === "checkbox"
        ) {
          console.log(infoItem);
          buffer = buffer.line(
            reverseHebrew(
              " ".repeat(centerRightGap + 2) + `${translation[key]}:`,
            ),
          );

          for (const num of item.extra[key]) {
            buffer = buffer.line(
              reverseHebrew(
                " ".repeat(centerRightGap + 3) +
                  infoItem.extra[key].items[num]?.name +
                  " ".repeat(
                    42 - 6 - [...infoItem.extra[key].items[num]?.name].length,
                  ) +
                  infoItem.extra[key].items[num]?.price +
                  " " +
                  'ש"ח',
              ),
            );
          }
        }
      }
    }
    buffer = buffer.align("left");
    total += item.price * item.amount;
  }

  //Content end

  let template = `סך הכל (כולל אחוז%): `;
  const allInAll = template.replace(
    "אחוז",
    Math.floor((order.percent - 1) * 100),
  );

  buffer = buffer
    .bold(true)
    .line(SEPERATOR)
    .bold(false)
    .align("center")
    .line(order.time)
    .line(order.date)
    .align("right")
    .line(
      reverseHebrew(' ש"ח') +
        String(Math.ceil(total * order.percent - total)) +
        reverseHebrew("שירות " + ")רשות(: "),
    )
    .bold(true)
    .line(
      reverseHebrew(' ש"ח') +
        String(Math.ceil(total * order.percent)) +
        reverseHebrew(allInAll),
    )
    .bold(false)
    .newline()
    .newline()
    .align("center")
    .line(reverseHebrew("הנא דרגו את המסעדה שלנו"))
    .qrcode(qrCode, 2, 4, "h");
  console.log(buffer);
  return buffer.encode();
}

async function styleRequestBon(order) {
  console.log(order);
  const waiter = await getWaiter(order.waiterID);

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

    //Header start:
    .align("right")
    .line(reverseHebrew("מספר שולחן: " + order.tableID))
    .line(reverseHebrew("מלצר מטפל: " + waiter))
    //.line FOR ORDER NUMBER TO DO
    .align("right");

  //Header end

  for (const item of order.items.order) {
    buffer = buffer.line(
      alignLeftRightCenter("", String(item.amount), reverseHebrew(item.name)),
    );

    if (item.extra) {
      const infoItem = (await getItem(item.id))[0];
      buffer = buffer.align("right");
      for (const key of Object.keys(infoItem.extra)) {
        if (
          key !== "variations" &&
          key !== "comment" &&
          infoItem.extra[key].type === "radio"
        ) {
          buffer = buffer.line(
            reverseHebrew(
              " ".repeat(centerRightGap + 2) +
                `${translation[key]}: ${
                  infoItem.extra[key].items[item.extra[key]]?.name ?? ""
                }`,
            ),
          );
        }

        if (
          key !== "variations" &&
          key !== "comment" &&
          infoItem.extra[key].type === "checkbox"
        ) {
          console.log(infoItem);
          buffer = buffer.line(
            reverseHebrew(
              " ".repeat(centerRightGap + 2) + `${translation[key]}:`,
            ),
          );

          for (const num of item.extra[key]) {
            buffer = buffer.line(
              reverseHebrew(
                " ".repeat(centerRightGap + 3) +
                  infoItem.extra[key].items[num]?.name,
              ),
            );
          }
        }
      }
      if (item.extra.comment) {
        buffer = buffer.line(reverseHebrew(item.extra.comment));
      }
    }
    buffer = buffer.align("left");
  }

  return buffer.encode();
}

async function processRequest(order) {
  console.log(order);
  if (order.type == "bill") {
    let buffer = await styleRequestBill(order);
    console.log(buffer);
    return buffer;
  } else {
    let buffer = await styleRequestBon(order);
    console.log(buffer);
    return buffer;
  }
}

async function print(order, autoClose = true) {
  try {
    const buffer = await processRequest(order);
    console.log(order);

    const conn = await connectPrinter(order.printer.address);

    // Write main content
    await delay(500);
    conn.write(buffer);
    await delay(500);

    // Add some empty lines
    let outerEncoder = encoder.initialize();
    for (let i = 0; i < 7; i++) {
      outerEncoder = outerEncoder.newline();
    }
    const outer = outerEncoder.cut("partial").encode();

    // Write cut command and optionally close
    conn.write(outer, async () => {
      if (autoClose) {
        conn.end(); // closes the connection
      }
    });
  } catch (err) {
    console.error("Failed to print:", err);
  }
}

async function printImage(img, width, height, address, autoClose = true) {
  try {
    console.log(height);
    const buffer = encoder.initialize().image(img, width, height).encode();
    const conn = await connectPrinter(address);

    // Write main content
    conn.write(buffer);
    await delay(500);

    conn.write(
      encoder.initialize().align("center").qrcode(qrCode, 2, 4, "h").encode(),
    );

    let outerEncoder = encoder
      .initialize()
      .newline()
      .newline()
      .newline()
      .newline();

    const outer = outerEncoder.cut("partial").encode();

    // Write cut command and optionally close
    conn.write(outer, async () => {
      if (autoClose) {
        conn.end(); // closes the connection
      }
    });
  } catch (err) {
    console.error("Failed to print:", err);
  }
}

async function printQR(qr) {
  let buffer = encoder
    .align("center")
    .line(qr, 2, 4, "h")
    .newline()
    .newline()
    .encode();
  const conn = await connectPrinter("192.168.10.66");

  conn.write(buffer);
  delay(500);

  let outerEncoder = encoder
    .initialize()
    .newline()
    .newline()
    .newline()
    .newline();

  const outer = outerEncoder.cut("partial").encode();

  // Write cut command and optionally close
  conn.write(outer, async () => {
    if (true) {
      conn.end(); // closes the connection
    }
  });
}

module.exports = { print, printImage, printQR };
