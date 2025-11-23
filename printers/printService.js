// printService.js
const net = require("net");

function buildOrderReceipt({ tableId, items, time }) {
  let output = "";
  output += "----- ORDER RECEIPT -----\n";
  output += `Table: ${tableId}\n`;
  output += `Time:  ${time}\n`;
  output += "--------------------------\n";

  items.forEach(item => {
    output += `${item.name} x${item.amount}\n`;
  });

  output += "--------------------------\n\n";
  return output;
}

function printToPrinter(printer, text) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    socket.connect(printer.port, printer.ip, () => {
      socket.write(text, () => {
        socket.end();
        resolve();
      });
    });

    socket.on("error", reject);
  });
}

module.exports = {
  buildOrderReceipt,
  printToPrinter,
};
