const { createCanvas } = require("canvas");
const fs = require("fs");

const { printImage } = require("./print");

const WIDTH = 576;
const HEIGHT = 1200;
const MARGIN = 24;
const LINE_HEIGHT = 32;

let y = MARGIN;

/* ----------------- HELPERS ----------------- */

function lineIncrease(size = 28) {
  if (size > LINE_HEIGHT) {
    y += size;
  } else {
    y += LINE_HEIGHT;
  }
}

function center(ctx, text, size = 28, bold = false) {
  ctx.font = `${bold ? "bold" : ""} ${size}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(text, WIDTH / 2, y);
  lineIncrease(size);
}

function left(ctx, text, size = 24) {
  ctx.font = `${size}px Arial`;
  ctx.textAlign = "left";
  ctx.fillText(text, MARGIN, y);
  lineIncrease(size);
}

function separator(ctx) {
  ctx.font = `24px Arial`;
  ctx.textAlign = "left";
  ctx.fillText("-".repeat(67), MARGIN, y);
  lineIncrease();
}

function leftRight(ctx, leftText, rightText, size = 24) {
  ctx.font = `${size}px Arial`;
  ctx.textAlign = "left";
  ctx.fillText(leftText, MARGIN, y);

  ctx.textAlign = "right";
  ctx.fillText(rightText, WIDTH - MARGIN, y);

  lineIncrease(size);
}

/* ----------------- RECEIPT ----------------- */
async function printCanvas(order, autoClose = true) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#000000";
  ctx.font = "24px Arial";
  ctx.textBaseline = "top";

  // Header
  center(ctx, "פטרה", 48, true);
  separator(ctx);

  // Order info
  left(ctx, "Order #1245");
  left(ctx, "2025-01-28 14:35");
  separator(ctx);

  // Items
  leftRight(ctx, "Burger", "25₪");
  leftRight(ctx, "Fries", "12₪");
  leftRight(ctx, "Cola", "8₪");
  separator(ctx);

  // Totals
  leftRight(ctx, "Subtotal", "45₪");
  leftRight(ctx, "VAT (17%)", "7.65₪");
  separator(ctx);
  leftRight(ctx, "TOTAL", "52.65₪", 28);

  lineIncrease();
  center(ctx, "Thank you!", 24);

  // Trim
  const finalCanvas = createCanvas(WIDTH, y + MARGIN);
  finalCanvas.getContext("2d").drawImage(canvas, 0, 0);

  fs.writeFileSync("helpers/image.png", finalCanvas.toBuffer("image/png"));

  printImage(finalCanvas, WIDTH, HEIGHT, order.printer.address);

  y = MARGIN;
}

module.exports = { printCanvas };
