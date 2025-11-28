async function fetchTables(sectionId) {
  const response = await fetch(`/api/get-tables-from-section/${sectionId}`);
  const data = await response.json();
  console.log(data);
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  createGrid(6, 6);

  data.forEach((row) => {
    const container = document.getElementById(row.location);

    container.textContent = "";
    container.className = "";
    container.classList.add("cell");

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
  const container = document.getElementById("section-container");
  container.innerHTML = ""; // clear previous boxes
  console.log(data);

  const customTextMap = {
    0: "טרסה ש",
    1: "טרסה פ",
    2: "בפנים חדש",
  };

  data.sectionIds.forEach((id) => {
    const box = document.createElement("div");
    box.classList.add("section-box");

    box.textContent = customTextMap[id];

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

  for (let y = 1; y <= rows; y++) {
    for (let x = 1; x <= cols; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${x}-${y}`;
      grid.appendChild(cell);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createGrid(6, 6);
  fetchSections();
});
