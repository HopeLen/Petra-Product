async function fetchTables(sectionId) {
  const response = await fetch(`/api/get-tables-from-section/${sectionId}`);
  const data = await response.json();
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
    container.classList.add("card");

    container.dataset.tableId = row.id;

    container.onclick = function () {
      //if (row.status !== "LOCKED") {
      console.log("Opening the table: " + row.id);
      window.location.href = `/table/table.html?id=${row.id}`;
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

async function fetchSections() {
  const response = await fetch("/api/get-table-sections");
  const data = await response.json();
  const customTextMapResponse = await fetch("/api/get-table-section-map");
  const customTextMap = await customTextMapResponse.json();

  createSections(
    data,
    customTextMap,
    document.getElementById("section-container")
  );
}

function createSections(data, map, container) {
  container.innerHTML = "";
  data.sectionIds.forEach((id) => {
    const box = document.createElement("div");
    box.classList.add("card");
    box.classList.add("section-box");

    box.textContent = map[id];

    box.onclick = () => fetchTables(id);

    container.appendChild(box);
  });
}

async function tableStatusChange(tableID, targetStatus) {
  try {
    await fetch("/api/set-table-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableID,
        targetStatus,
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

function createGrid(cols, rows) {
  const grid = document.getElementById("grid");
  grid.innerHTML = ""; // clear previous cells
  grid.style.setProperty("--cols", cols);
  grid.style.setProperty("--rows", rows);

  for (let y = rows; y >= 1; y--) {
    for (let x = 1; x <= cols; x++) {
      const cell = document.createElement("div");
      cell.classList.add("card");
      cell.id = `${x}-${y}`;
      grid.appendChild(cell);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      // Page is coming from the bfcache
      window.location.reload();
    }
  });

  fetchSections();
});

module.exports = { createSections };
