import scripts from "./scripts.js";

async function checkContent(id) {
  switch (id) {
    case "Z סגירת":
      scripts.display.displayZClose(id);
      break;
    case "שולחנות":
      scripts.display.displayTables(id);
      break;
    case "תפריט":
      scripts.display.displayMenu(id);
      break;
    case "מלצרים":
      scripts.display.displayWaiters(id);
      break;
    case "מדפסות":
      scripts.display.displayPrinters(id);
      break;
    case "מידע":
      scripts.display.displayInfo(id);
  }
}

export default { checkContent };
