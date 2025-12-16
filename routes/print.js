const net = require("net");

const PRINTER_IP = "192.168.10.59";
const PRINTER_PORT = 9100;

let printer = null;

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

function print(buffer, autoClose = true) {
  const conn = connectPrinter();
  conn.write(buffer, () => {
    if (autoClose) {
      closePrinter();
    }
  });
}

module.exports = { print };
