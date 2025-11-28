async function fetchTables(sectionId) {
  const response = await fetch(`/api/get-tables-from-section/${sectionId}`);
  const data = await response.json();
  const container = document.getElementById("container");
  container.innerHTML = "";
  console.log(data);

  data.forEach((row) => {
    const div = document.createElement("div");
    div.className = "box";

    //if(row.status != "LOCKED"){
    div.onclick = function () {
      console.log("Opening the table: " + row.id);
      tableStatusChange(row.id, "LOCKED");
      window.location.href = `/table/table.html?id=${row.id}`;
    };
    /*
    } else{
      div.onclick = function(){
        alert("מישהו כבר נמצא בשולחן... נסו שנית אחר כך")
      }
    }
*/
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
      case "LOCKED":
        div.classList.add("status-locked");
        break;
      default:
        div.style.backgroundColor = "lightblue";
    }

    div.textContent = row.id; // show id
    container.appendChild(div);
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

    // Add onclick event to call fetchTables with the section ID
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

document.addEventListener("DOMContentLoaded", () => {
  fetchSections();
});
