import scripts from "./scripts.js";

function title(id, container) {
  const title = document.createElement("h1");
  title.textContent = ":" + id;

  container.appendChild(title);
}

async function displayZClose(id) {
  const tables = await scripts.routes.getAwaitingTables();
  console.log(tables);

  const container = document.getElementById("content");
  container.innerHTML = "";
  title(id, container);

  const searchWrapper = document.createElement("div");
  searchWrapper.classList.add("search-wrapper");

  const searchBar = document.createElement("input");
  searchBar.type = "number";
  searchBar.placeholder = "הכנס מספר הזמנה";
  searchBar.id = id;

  container.appendChild(searchBar);

  const userCards = document.createElement("div");
  userCards.classList.add("user-cards");

  tables.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.id = card.orderID;

    console.log("Creating the element: ", card.orderID);

    const cardHeader = document.createElement("div");
    const cardTable = document.createElement("div");
    const cardBody = document.createElement("div");

    cardHeader.classList.add("card-header");
    cardTable.classList.add("card-table");
    cardBody.classList.add("card-body");

    cardHeader.textContent = "מספר הזמנה: " + card.orderID;
    cardTable.textContent = "מספר שולחן: " + card.information.table;
    cardBody.textContent =
      "סכום: " +
      Math.round(
        scripts.helpers.getOrderTotal(card.order) * card.information.percent,
      ) +
      ".00₪";

    cardElement.appendChild(cardHeader);
    cardElement.appendChild(cardTable);
    cardElement.appendChild(cardBody);

    cardElement.onclick = () => {
      scripts.ZClosePopUp.ZClosePopUp(card);
    };

    userCards.appendChild(cardElement);
  });

  searchWrapper.appendChild(userCards);

  container.appendChild(searchWrapper);

  searchBar.addEventListener("input", (e) => {
    const value = e.target.value;
    console.log(value);

    tables.forEach((table) => {
      const isVisible = String(table.orderID).includes(value);
      document
        .getElementById(table.orderID)
        .classList.toggle("hide", !isVisible);
    });
  });
}

async function displayTables(id) {
  const container = document.getElementById("content");
  container.innerHTML = "";
  title(id, container);

  const table_content = document.createElement("div");
  table_content.classList.add("table-content");

  const tables = document.createElement("div");
  tables.classList.add("main-tables");
  tables.id = "tables";

  table_content.appendChild(tables);

  const sections = document.createElement("div");
  sections.classList.add("section-list");

  const sectionTitle = document.createElement("div");
  sectionTitle.textContent = "אזורים";
  sections.appendChild(sectionTitle);
  scripts.helpers.createSections(sections, tables);

  table_content.appendChild(sections);

  container.appendChild(table_content);
}

async function displayMenu(id) {
  const container = document.getElementById("content");
  container.innerHTML = "";
  title(id, container);
}
async function displayWaiters(id) {
  const container = document.getElementById("content");
  container.innerHTML = "";
  title(id, container);
}
async function displayPrinters(id) {
  const container = document.getElementById("content");
  container.innerHTML = "";
  title(id, container);
}
async function displayInfo(id) {
  const container = document.getElementById("content");
  container.innerHTML = "";
  title(id, container);
}

export default {
  displayZClose,
  displayInfo,
  displayMenu,
  displayPrinters,
  displayWaiters,
  displayTables,
};
