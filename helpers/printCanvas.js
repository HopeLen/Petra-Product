const { createCanvas, registerFont } = require("canvas");
const fs = require("fs");
const bidiFactory = require("bidi-js");
const bidi = bidiFactory();

const { printImage } = require("./print");

const pool = require("../routes/mariadb");
const translation = require("../assets/maps/translation-map.json");

const WIDTH = 576;
const HEIGHT = 5000;
const MARGIN = 24;
const LINE_HEIGHT = 32;

let y = MARGIN;
const font = "Ariel";
/* ----------------- HELPERS ----------------- */

function hasNonVariationKeys(item) {
  try {
    return (
      item.extra &&
      Object.keys(item.extra).some(
        (key) => key !== "variations" && key !== "comment",
      )
    );
  } catch (e) {
    return false;
  }
}

function commentExsists(item) {
  try {
    return item.comment && item.comment !== "";
  } catch (e) {
    return false;
  }
}

function drawRoundedRect(ctx, x, yTop, width, yBottom, radius) {
  const height = yBottom - yTop;
  if (radius > width / 2) radius = width / 2;
  if (radius > height / 2) radius = height / 2;

  ctx.beginPath();
  ctx.moveTo(x + radius, yTop);
  ctx.lineTo(x + width - radius, yTop);
  ctx.arcTo(x + width, yTop, x + width, yTop + radius, radius);
  ctx.lineTo(x + width, yTop + height - radius);
  ctx.arcTo(
    x + width,
    yTop + height,
    x + width - radius,
    yTop + height,
    radius,
  );
  ctx.lineTo(x + radius, yTop + height);
  ctx.arcTo(x, yTop + height, x, yTop + height - radius, radius);
  ctx.lineTo(x, yTop + radius);
  ctx.arcTo(x, yTop, x + radius, yTop, radius);
  ctx.closePath();

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function toPercent(num) {
  console.log((num - 1) * 100);
  return Math.round((num - 1) * 100);
}

async function getItem(id) {
  try {
    const rows = await pool.query("SELECT * FROM menu WHERE id = ?", id);
    return rows;
  } catch (err) {
    console.error(err);
    return err;
  }
}

function containsHebrew(text) {
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text);
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

function lineIncrease(size = 28) {
  if (size > LINE_HEIGHT) {
    y += size;
  } else {
    y += LINE_HEIGHT;
  }
}

function nextMultipleOf8(n) {
  return Math.ceil(n / 8) * 8;
}

function newLine() {
  y += LINE_HEIGHT / 2;
}

function center(ctx, text, size = 28, bold = false) {
  ctx.font = `${bold ? "bold" : ""} ${size}px ${font}`;
  ctx.textAlign = "center";
  ctx.fillText(text, WIDTH / 2, y);
  lineIncrease(size);
}

function right(ctx, text, size = 24) {
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = "right";
  ctx.fillText(text, WIDTH - MARGIN, y);
  lineIncrease(size);
}

function separator(ctx) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(WIDTH, y);
  ctx.lineWidth = 3;
  ctx.stroke();
  y += 10;
}

function leftRight(ctx, leftText, rightText, size = 28) {
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = "left";
  ctx.fillText(leftText, MARGIN, y);

  ctx.textAlign = "right";
  ctx.fillText(rightText, WIDTH - MARGIN, y);

  lineIncrease(size);
}

function leftCenterRight(
  ctx,
  leftText,
  centerText,
  rightText,
  bold = false,
  centerOffset = 170,
  size = 28,
) {
  console.log(bold);
  ctx.font = `${bold ? "bold" : ""} ${size}px ${font}`;

  // Left
  ctx.textAlign = "left";
  ctx.fillText(leftText, MARGIN, y);

  // Center (with offset)
  ctx.textAlign = "right";
  ctx.fillText(centerText, WIDTH / 2 + centerOffset, y);

  // Right
  ctx.textAlign = "right";
  ctx.fillText(rightText, WIDTH - MARGIN, y);

  lineIncrease(size);
}

/* ----------------- RECEIPT ----------------- */
async function printBill(order) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  const waiter = await getWaiter(order.waiterID);

  console.log(order);

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#000000";
  ctx.font = `24px ${font}`;
  ctx.textBaseline = "top";

  // Header
  center(ctx, "פטרה", 60, true);
  newLine();

  // Order info
  leftRight(ctx, "מספר הזמנה: " + 12345, "שולחן מספר: " + order.tableID);
  separator(ctx);

  // Items

  leftCenterRight(ctx, "מחיר", "פריט", "כמות");

  let total = 0;
  for (const item of order.items.order) {
    let startY = y;
    console.log(item);
    leftCenterRight(
      ctx,
      "₪" + item.price * item.amount + ".00",
      item.name,
      item.amount,
    );
    const infoItem = (await getItem(item.id))[0];

    if (hasNonVariationKeys(infoItem.extra)) {
      for (const key of Object.keys(infoItem.extra)) {
        if (key !== "variations" && infoItem.extra[key].type === "radio") {
          let string;

          console.log(
            key,
            containsHebrew(infoItem.extra[key].items[item.extra[key]].name),
          );
          if (containsHebrew(infoItem.extra[key].items[item.extra[key]].name)) {
            string =
              " ".repeat(MARGIN) +
              translation[key] +
              ": " +
              (infoItem.extra[key].items[item.extra[key]]?.name ?? "");
          } else {
            string =
              " ".repeat(MARGIN) +
              (infoItem.extra[key].items[item.extra[key]]?.name ?? "") +
              " :" +
              translation[key];
          }

          leftCenterRight(ctx, "", string, "");
        }
        if (
          key !== "variations" &&
          infoItem.extra[key].type === "checkbox" &&
          item.extra[key]
        ) {
          console.log(infoItem);
          leftCenterRight(
            ctx,
            "",
            " ".repeat(MARGIN) + `:${translation[key]}`,
            "",
          );

          console.log(item.extra[key]);
          for (const num of item.extra[key]) {
            leftCenterRight(
              ctx,
              "₪" + infoItem.extra[key].items[num]?.price + ".00",
              infoItem.extra[key].items[num]?.name + " ".repeat(5),
              "",
            );
          }
        }
      }
    }
    if (hasNonVariationKeys(infoItem)) {
      drawRoundedRect(ctx, 5, startY - 2, WIDTH - 22, y, 10);
    }
    newLine();
    total += item.price * item.amount;
  }

  separator(ctx);

  // Totals
  newLine();
  leftCenterRight(
    ctx,
    "₪" + Math.round(total * order.percent - total) + ".00",
    "",
    "כולל: " + toPercent(order.percent) + "% " + "שירות (רשות) ",
    true,
  );
  console.log(total);
  console.log();

  leftCenterRight(
    ctx,
    "₪" + Math.round(total * order.percent) + ".00",
    "",
    ":סך לתשלום",
    true,
  );

  lineIncrease();
  separator(ctx);

  leftCenterRight(ctx, "", order.time, "");
  leftCenterRight(ctx, "", order.date, "");
  leftCenterRight(ctx, "", "מלצר מטפל: " + waiter, "");

  newLine();

  leftCenterRight(ctx, "", "", "!תודה שבחרתם פטרה");
  leftCenterRight(ctx, "088-65-16-10", "", ":לסגירת אירועים");
  leftCenterRight(ctx, "", "", "תודה ולהתראות");
  center(ctx, "!דרגו את המסעדה שלנו");

  // Trim
  const finalCanvas = createCanvas(WIDTH, y + MARGIN);
  finalCanvas.getContext("2d").drawImage(canvas, 0, 0);

  fs.writeFileSync("helpers/image.png", finalCanvas.toBuffer("image/png"));

  printImage(
    finalCanvas,
    WIDTH,
    nextMultipleOf8(y + MARGIN),
    order.printer.address,
    true,
  );

  y = MARGIN;
}

async function printBon(order) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  const waiter = await getWaiter(order.waiterID);

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#000000";
  ctx.font = `24px ${font}`;
  ctx.textBaseline = "top";

  // Header
  center(ctx, "פטרה", 60, true);
  newLine();

  // Order info
  leftRight(ctx, "", "מלצר מטפל: " + waiter);
  leftRight(ctx, "מספר הזמנה: " + 12345, "שולחן מספר: " + order.tableID);
  separator(ctx);

  //Items
  leftCenterRight(ctx, "", "פריט", "כמות");

  let total = 0;
  for (const item of order.items.order) {
    let startY = y;
    console.log(item);
    leftCenterRight(ctx, "", item.name, item.amount);

    const infoItem = (await getItem(item.id))[0];

    if (infoItem.extra) {
      for (const key of Object.keys(infoItem.extra)) {
        if (
          key !== "variations" &&
          key !== "comment" &&
          infoItem.extra[key].type === "radio"
        ) {
          let string;

          console.log(
            key,
            containsHebrew(infoItem.extra[key].items[item.extra[key]].name),
          );
          if (containsHebrew(infoItem.extra[key].items[item.extra[key]].name)) {
            string =
              " ".repeat(MARGIN) +
              translation[key] +
              ": " +
              (infoItem.extra[key].items[item.extra[key]]?.name ?? "");
          } else {
            string =
              " ".repeat(MARGIN) +
              (infoItem.extra[key].items[item.extra[key]]?.name ?? "") +
              " :" +
              translation[key];
          }

          leftCenterRight(ctx, "", string, "");
        }
        if (
          key !== "variations" &&
          key !== "comment" &&
          infoItem.extra[key].type === "checkbox" &&
          item.extra[key]
        ) {
          console.log(infoItem);
          leftCenterRight(
            ctx,
            "",
            " ".repeat(MARGIN) + `:${translation[key]}`,
            "",
          );

          for (const num of item.extra[key]) {
            leftCenterRight(
              ctx,
              "",
              infoItem.extra[key].items[num]?.name + " ".repeat(5),
              "",
            );
          }
        }
      }
    }
    if (commentExsists(item.extra)) {
      console.log("entered");
      leftCenterRight(ctx, "", item.extra.comment + " ".repeat(5) + "**", "");
    }
    if (hasNonVariationKeys(infoItem)) {
      drawRoundedRect(ctx, 5, startY - 2, WIDTH - 22, y, 10);
    }
    newLine();
    total += item.price * item.amount;
  }

  separator(ctx);
  leftCenterRight(ctx, order.time, "", order.date);

  // Trim
  const finalCanvas = createCanvas(WIDTH, y + MARGIN);
  finalCanvas.getContext("2d").drawImage(canvas, 0, 0);

  fs.writeFileSync("helpers/image.png", finalCanvas.toBuffer("image/png"));

  printImage(
    finalCanvas,
    WIDTH,
    nextMultipleOf8(y + MARGIN),
    order.printer.address,
  );
  y = MARGIN;
}

module.exports = { printBill, printBon };
