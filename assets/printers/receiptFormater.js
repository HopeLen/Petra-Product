// receiptFormatter.js
const iconv = require("iconv-lite");

const LINE_WIDTH = 48;

// ESC/POS bytes
const ESC = 0x1b;
const GS = 0x1d;

// Commands
const FLUSH = Buffer.from([0x1d, 0x0c]);
const INIT = [ESC, 0x40];
const LF = [0x0a];
const CUT = [
  0x1b,
  0x64,
  0x03, // ESC d n → feed n lines
  0x1d,
  0x56,
  0x41, // GS V A → full cut
];

const ALIGN_LEFT = [ESC, 0x61, 0x00];
const ALIGN_CENTER = [ESC, 0x61, 0x01];
const ALIGN_RIGHT = [ESC, 0x61, 0x02];

const BOLD_ON = [ESC, 0x45, 0x01];
const BOLD_OFF = [ESC, 0x45, 0x00];

const DOUBLE_ON = [GS, 0x21, 0x11];
const DOUBLE_OFF = [GS, 0x21, 0x00];

// ─────────────────────────────────────────────
// Encoding helper
// ─────────────────────────────────────────────
function encodeHebrew(text) {
  return iconv.encode(text, "cp862");
}

// ─────────────────────────────────────────────
// RTL helpers (reverse Hebrew letters, keep numbers)
// ─────────────────────────────────────────────
// Reverse Hebrew letters but leave trailing numbers/punctuation at the end
function reverseHebrewKeepNumbersAtEnd(str) {
  let s = str;

  // 1️⃣ Extract prefix like "2x "
  let prefix = "";
  const prefixMatch = s.match(/^(\d+x\s*)/);
  if (prefixMatch) {
    prefix = prefixMatch[1];
    s = s.slice(prefix.length);
  }

  // 2️⃣ Extract trailing number like " 0.5", " 45.00"
  let numberPart = "";
  const numberMatch = s.match(/(\s[\d.]+)$/);
  if (numberMatch) {
    numberPart = numberMatch[1];
    s = s.slice(0, -numberPart.length);
  }

  // 3️⃣ Reverse ONLY Hebrew letters (everything left now)
  const reversedHebrew = s.split("").reverse().join("");

  console.log(numberPart + "   " + reversedHebrew + "   " + prefix);

  // 4️⃣ Visual RTL order for LTR printer
  return numberPart + "   " + reversedHebrew + "    " + prefix;
}

function rtlLine(text) {
  return reverseHebrewKeepNumbersAtEnd(text) + "\n";
}

function rtlCenter(text) {
  const pad = Math.max(0, Math.floor((LINE_WIDTH - text.length) / 2));
  return " ".repeat(pad) + reverseHebrewKeepNumbersAtEnd(text) + "\n";
}

function rtlLineChar(char = "-") {
  return char.repeat(LINE_WIDTH) + "\n";
}

function rtlRow(left, right) {
  const leftReversed = reverseHebrewKeepNumbersAtEnd(left);
  const space = LINE_WIDTH - leftReversed.length - right.length;
  console.log("SPACE:" + " ".repeat(space) + "END");
  return right + " ".repeat(space) + leftReversed + "\n";
}

// ─────────────────────────────────────────────
// Receipt builder
// ─────────────────────────────────────────────
function buildReceipt({ shopName, phone, items, total }) {
  const buffers = [];

  buffers.push(Buffer.from(INIT));

  // Header
  buffers.push(Buffer.from(ALIGN_CENTER));
  buffers.push(Buffer.from(BOLD_ON));
  buffers.push(Buffer.from(DOUBLE_ON));
  buffers.push(encodeHebrew(rtlLine(shopName)));
  buffers.push(Buffer.from(DOUBLE_OFF));
  buffers.push(Buffer.from(BOLD_OFF));

  if (phone) {
    buffers.push(encodeHebrew(rtlCenter(`Tel: ${phone}`)));
  }

  buffers.push(encodeHebrew(rtlLine("תודה על הקנייה שלך")));
  buffers.push(Buffer.from(LF));

  // Items
  buffers.push(Buffer.from(ALIGN_LEFT));
  buffers.push(encodeHebrew(rtlLineChar()));
  for (const item of items) {
    const itemTotal = (item.price * item.amount).toFixed(2);
    const itemName = `${item.amount}x ${item.name}`;
    //item.amount > 1 ? `${item.amount}x ${item.name}` : item.name;
    buffers.push(encodeHebrew(rtlRow(itemName, itemTotal)));
    buffers.push(Buffer.from("\n"));
  }
  buffers.push(encodeHebrew(rtlLineChar()));

  // Total
  buffers.push(Buffer.from(BOLD_ON));
  buffers.push(encodeHebrew(rtlRow(":סהכ", total.toFixed(2))));
  buffers.push(Buffer.from(BOLD_OFF));

  buffers.push(encodeHebrew(rtlLine("\nכולל מעמ\n")));

  buffers.push(FLUSH);
  buffers.push(Buffer.from(CUT));

  return Buffer.concat(buffers);
}

function emptyLine() {
  const buffers = [];
  buffers.push(Buffer.from("\n", "ascii"));

  return Buffer.concat(buffers);
}

module.exports = {
  emptyLine,
  buildReceipt,
};
