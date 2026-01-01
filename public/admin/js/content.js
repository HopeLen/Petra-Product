async function checkContent(id) {
  switch (id) {
    case "Z סגירת":
      displayZClose();
      break;
    case "שולחנות":
      displayTables();
      break;
    case "תפריט":
      displayMenu();
      break;
    case "מלצרים":
      displayWaiters();
      break;
    case "מדפסות":
      displayPrinters();
      break;
    case "מידע":
      displayInfo();
  }
}

export default { checkContent };
