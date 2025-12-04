function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getOrder(tableID) {
  const ul = document.getElementById("current-order");
  const response = await fetch(`/api/get-table-order/${tableID}`);

  const order = await response.json();

  console.log(order);
  const response2 = await fetch(`/api/get-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order }),
  });

  const items = await response2.json();

  console.log(items);

  appendToList(items, order, ul);
}

function appendToList(items, order, ul) {
  items.forEach((item) => {
    const li = document.createElement("li");
    const menuItem = order.order.find((m) => m.itemID === item.id);
    //console.log(menuItem);
    //console.log(item);
    li.innerHTML = `
    <span>X${menuItem.amount} ${item.name}</span>
    <span>${item.price * menuItem.amount}₪</span>
  `;
    ul.append(li);
  });
}

function getInfo(tableID) {
  const info = document.getElementById("information");
  info.textContent = "מספר שולחן: " + tableID;
}

async function getMenuSections(checked) {
  const classList = ["card", "menu-box"];
  let response;
  let response2;
  console.log(checked);
  if (checked == "KITCHEN") {
    response = await fetch("/api/get-menu-sections-KITCHEN");
    response2 = await fetch("/api/get-KITCHEN-menu-map");
  } else {
    response = await fetch("/api/get-menu-sections-BAR");
    response2 = await fetch("/api/get-BAR-menu-map");
  }
  console.log(response);
  console.log(response2);
  const menu = await response.json();
  const map = await response2.json();
  console.log(map);
  createSections(
    menu,
    map,
    document.getElementById("menu-sections"),
    classList
  );
}

function createSections(data, map, container, classList) {
  container.innerHTML = "";
  data.sectionIds.forEach((id) => {
    const box = document.createElement("div");
    classList.forEach((styleClass) => {
      box.classList.add(styleClass);
    });
    box.textContent = map[id];
    console.log(map[id]);
    box.onclick = () => fetchMenu(id);

    container.appendChild(box);
  });
}

function createMenuItems(data, container, classList) {
  container.innerHTML = "";
  data.forEach((item) => {
    const box = document.createElement("div");
    console.log(item);
    classList.forEach((styleClass) => {
      box.classList.add(styleClass);
    });
    box.innerHTML = item.name;
    box.onclick = () => addItemToOrder(item);

    container.append(box);
  });
}

async function changeMenuSection(request) {
  document.querySelector(".panel").style.transform = "translateX(0)";
  document.querySelector(".panel").style.zIndex = "-1";

  await delay(500);

  await getMenuSections(request);
  document.querySelector(".panel").style.transform = "translateX(115%)";
  await delay(500);
  document.querySelector(".panel").style.zIndex = "0";
}

async function fetchMenu(id) {
  const container = document.getElementById("main-menu");
  const response = await fetch(`/api/get-menu-section/${id}`);
  const data = await response.json();
  console.log(data);

  const classList = ["card", "menu-item"];

  createMenuItems(data, container, classList);
}

//event listeners:
document.getElementById("value-1").addEventListener("change", async () => {
  await changeMenuSection("BAR");
});

document.getElementById("value-2").addEventListener("change", async () => {
  await changeMenuSection("KITCHEN");
});

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tableID = params.get("id");
  console.log("SUCCSESS");
  console.log(tableID);

  getOrder(tableID);
  getInfo(tableID);
});
