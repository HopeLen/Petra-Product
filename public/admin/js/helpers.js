import scripts from "./scripts.js";

function getOrderTotal(order) {
  let total = 0;
  order.forEach((item) => {
    total += item.price * item.amount;
  });
  return total;
}

function createSections(data, map, container) {
  container.innerHTML = "";
  data.sectionIds.forEach((id) => {
    const box = document.createElement("div");
    box.classList.add("table-card");
    box.classList.add("section-box");

    box.textContent = map[id];

    box.onclick = async () => {
      const tables = await scripts.routes.fetchTables(id);
      scripts.helpers.showTables(tables);
    };

    container.appendChild(box);
  });
}

function createGrid(cols, rows) {
  const grid = document.getElementById("grid");
  grid.innerHTML = ""; // clear previous cells
  grid.style.setProperty("--cols", cols);
  grid.style.setProperty("--rows", rows);

  for (let y = rows; y >= 1; y--) {
    for (let x = 1; x <= cols; x++) {
      const cell = document.createElement("div");
      cell.classList.add("table-card");
      cell.id = `${x}-${y}`;
      grid.appendChild(cell);
    }
  }
}

function showTables(data) {
  console.log(data);
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  let maxCol = 5;
  let maxRow = 5;
  data.forEach((row) => {
    const [colNum, rowNum] = row.location.split("-").map(Number);

    if (colNum > maxCol) {
      maxCol = colNum;
    }
    if (rowNum > maxRow) {
      maxRow = rowNum;
    }
  });

  console.log(maxCol, maxRow);
  createGrid(maxCol, maxRow);

  data.forEach((row) => {
    const container = document.getElementById(row.location);

    container.textContent = "";
    container.className = "";
    container.classList.add("table-card");

    if (row.shape == "C") {
      container.style.borderRadius = "50%";
      container.style.width = container.offsetHeight + "px";
      container.style.marginLeft = "auto";
      container.style.marginRight = "auto";
    }

    container.dataset.tableId = row.id;

    container.onclick = function () {
      //if (row.status !== "LOCKED") {
      console.log("Opening the table: " + row.id);

      const waiterId = prompt("הכנס קוד:");

      if (waiterId === null || waiterId.trim() === "") {
        // User cancelled or entered nothing
        return;
      }

      window.location.href = `/table/table.html?tableId=${row.id}&waiterId=${waiterId}`;
      //} else {
      //alert("מישהו כבר נמצא בשולחן... נסו שנית אחר כך");
      //}
    };
    console.log(row.status);

    switch (row.status) {
      case "OPEN":
        container.classList.add("status-open");
        break;
      case "TAKEN":
        container.classList.add("status-taken");
        break;
      case "BILLED":
        container.classList.add("status-billed");
        break;
      case "LOCKED":
        container.classList.add("status-locked");
        break;
      default:
        container.style.backgroundColor = "lightblue";
    }

    // Display row ID inside container
    container.textContent = row.id;
  });
}

export default { getOrderTotal, createSections, showTables };
