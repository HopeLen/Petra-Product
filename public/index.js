// Fetches all tables from a certain section and creates divs for all of them
async function fetchTables(sectionId) {
  const response = await fetch(`/api/get-tables-section/${sectionId}`);
  const data = await response.json();
  const container = document.getElementById("container");
  container.innerHTML = "";
  console.log(data);

  data.forEach((row) => {
    const div = document.createElement("div");
    div.className = "box";

    // Change color based on status
    switch (row.status) {
      case "OPEN":
        div.classList.add("status-open");
        break;
      case "TAKEN":
        div.classList.add("status-taken");
        break;
      case "BILLED":
        div.classList.add("status-billed");
        break;
      default:
        div.style.backgroundColor = "lightblue";
    }

    div.textContent = row.id; // show id
    container.appendChild(div);
  });
}

// Fetches all unique section IDs, maps their names and creates sections for all of them
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

    // Add onclick event to call fetchTables with the section ID
    box.onclick = () => fetchTables(id);

    container.appendChild(box);
  });
}

//Printing request (Data type = JSON)
async function sendPrintRequest(orderData) {
  try {
    const response = await fetch("/api/print-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Print failed:", result);
      alert("Error printing: " + result.error);
      return;
    }

    console.log("Print success:", result);
    alert("Print sent successfully!");
  } catch (error) {
    console.error("Request error:", error);
    alert("Could not connect to the printer server.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchSections();
});