const config = require("./printers");
const { printer: ThermalPrinter, types } = require("node-thermal-printer");

const printers = config.map(p => ({
  name: p.name,
  device: new ThermalPrinter({
    type: types.EPSON,
    interface: `tcp://${p.ip}:9100`,
    timeout: 3000,
  })
}));

module.exports = printers;
