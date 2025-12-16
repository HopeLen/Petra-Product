// receiptFormatter.js
// ESC/POS helper for 80mm receipt printers (48 chars width)

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
  0x03, // ESC d n → feed n lines (3)
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
// Formatting helpers
// ─────────────────────────────────────────────

function center(text) {
  const pad = Math.max(0, Math.floor((LINE_WIDTH - text.length) / 2));
  return " ".repeat(pad) + text + "\n";
}

function line(char = "-") {
  return char.repeat(LINE_WIDTH) + "\n";
}

function row(left, right) {
  const space = LINE_WIDTH - left.length - right.length;
  return left + " ".repeat(Math.max(1, space)) + right + "\n";
}

// ─────────────────────────────────────────────
// Receipt builder
// ─────────────────────────────────────────────

function buildReceipt({ shopName, phone, items, total }) {
  const buffers = [];

  buffers.push(Buffer.from(INIT));

  buffers.push(Buffer.from(ALIGN_CENTER));
  buffers.push(Buffer.from(BOLD_ON));
  buffers.push(Buffer.from(DOUBLE_ON));
  buffers.push(Buffer.from(shopName + "\n"));
  buffers.push(Buffer.from(DOUBLE_OFF));
  buffers.push(Buffer.from(BOLD_OFF));

  if (phone) {
    buffers.push(Buffer.from(center(`Tel: ${phone}`)));
  }

  buffers.push(Buffer.from("Thank you for your purchase"));
  buffers.push(Buffer.from(LF));

  buffers.push(Buffer.from(ALIGN_LEFT));
  buffers.push(Buffer.from(line()));
  console.log(items);
  for (const item of items) {
    buffers.push(Buffer.from(row(item.name, item.price.toFixed(2))));
  }

  buffers.push(Buffer.from(line()));

  buffers.push(Buffer.from(BOLD_ON));
  buffers.push(Buffer.from(row("TOTAL", total.toFixed(2))));
  buffers.push(Buffer.from(BOLD_OFF));

  buffers.push(Buffer.from("\n"));
  buffers.push(Buffer.from(ALIGN_CENTER));
  buffers.push(Buffer.from("VAT included\n\n"));

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
