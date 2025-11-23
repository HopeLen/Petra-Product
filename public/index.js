async function fetchTables(sectionId) {
  const response = await fetch(`/api/get-tables-section/${sectionId}`);
  const data = await response.json();
  const container = document.getElementById("container");
  container.innerHTML = "";
  console.log(data)

  data.forEach(row => {
    const div = document.createElement("div");
    div.className = "box";

    // Change color based on status
    switch(row.status) {
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


async function fetchSections() {
  const response = await fetch("/api/get-table-sections");
  const data = await response.json();
  const container = document.getElementById("section-container");
  container.innerHTML = ""; // clear previous boxes
  console.log(data);

  const customTextMap = {
    0: "טרסה ש",
    1: "טרסה פ"
  };

  data.sectionIds.forEach(id => {
    const box = document.createElement("div");
    box.classList.add("section-box");


    box.textContent = customTextMap[id]

    // Add onclick event to call fetchTables with the section ID
    box.onclick = () => fetchTables(id);

    container.appendChild(box);
  });
}





document.addEventListener("DOMContentLoaded", () => {
  fetchSections();
});


  