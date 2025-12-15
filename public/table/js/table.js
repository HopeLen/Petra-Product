let currentOrder = [];

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
  let mutability = false;
  renderOrderList(
    document.getElementById("current-order"),
    order.order,
    mutability
  );
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

function renderOrderList(ul, list, mutability = true) {
  ul.innerHTML = ""; // clear list

  list.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <span>X${item.amount} ${item.name}</span>
    <span>${item.price * item.amount}₪</span>
  `;
    li.onclick = async () => {
      const infoItem = await fetch(`/api/get-menu-item/${item.id}`).then(
        (response) => response.json()
      );
      await createPopupFromItem(infoItem[0]);
      await delay(100);
      console.log("This is renderOrderList's mutability: " + mutability);
      fixPopupFromItem(item, index, infoItem[0], mutability);
      console.log("DONE");
    };
    ul.appendChild(li);
  });
}

function buildItemLabel(item) {
  // SIMPLE ITEM
  if (isCommentEmpty(item.comment)) {
    return `${item.name || item.name} - ${item.price}₪`;
  }

  // COMPLEX ITEM (with comment)
  const c = item.comment;
  let label = `${item.variations[c.version].name} - ${c.price}₪`;

  label += ` (${item.doneness[c.doneness].name}`;

  if (c.additions.length > 0) {
    label += ", ";
    label += c.additions.map((i) => item.additions[i].name).join(", ");
  }

  label += ")";

  return label;
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
    if (item.visibility != 0) {
      const box = document.createElement("div");
      console.log(item);
      classList.forEach((styleClass) => {
        box.classList.add(styleClass);
      });
      box.innerHTML = item.name;
      box.onclick = () => addItemToOrder(item);

      container.append(box);
    }
  });
}

function requiresPopup(item) {
  return item.extra != null;
}

function isCommentEmpty(comment) {
  return (
    comment == null ||
    (typeof comment === "string" && comment.trim() === "") ||
    (typeof comment === "object" && Object.keys(comment).length === 0)
  );
}

function addItemToOrder(item) {
  console.log("Adding item:", item);

  if (requiresPopup(item)) {
    // This is a complex item → needs customization popup
    createPopupFromItem(item);
  } else {
    // Simple item → add directly with no comment
    addSimpleItem(item);
  }
  console.log(currentOrder);
  let mutability = true;
  renderOrderList(
    document.getElementById("chosen-items"),
    currentOrder,
    mutability
  );
}

async function createPopupFromItem(item) {
  activatePopup(item);

  const tranlationResponse = await fetch("/api/get-translation-map");
  const tranlation = await tranlationResponse.json();
  console.log(tranlation);

  const title = document.getElementById("item-title");
  const options = document.getElementById("options");

  title.innerHTML = "";
  options.innerHTML = "";

  //console.log("Item Variations:", item.extra.variations);
  //console.log("Item Doneness:", item.extra.doneness);
  //console.log("Item Additions:", item.extra.additions);
  //console.log("Item Extras:", item.extra.extra);

  //naming the popup
  title.textContent = item.name;

  //creating option elements
  if (requiresPopup(item)) {
    Object.keys(item.extra).forEach((key) => {
      const div = document.createElement("div");
      div.id = key;
      div.classList.add("option-box");
      options.appendChild(div);
      //console.log(div);
      //console.log(item.extra[key].items);

      createList(
        key,
        tranlation[key],
        item.extra[key].items,
        item.extra[key].type
      );
    });
  }

  document.getElementById("send").textContent = "שמור שינויים";
}

function addSimpleItem(item) {
  const orderEntry = {
    id: item.id,
    name: item.name,
    amount: 1,
    price: item.price,
    extra: item.extra,
  };
  if (document.getElementById("comment").value) {
    orderEntry.extra = {};
    orderEntry.extra.comment = document.getElementById("comment").value;
  }

  currentOrder = addOrIncrease(currentOrder, orderEntry);
  console.log("Current order is:");
  console.log(currentOrder);
}

function addComplexItem(item) {
  let finalItem = {};
  const amount = Number(document.getElementById("amount").value);
  const extra = getAllInputs();
  extra.comment = document.getElementById("comment").value;

  finalItem.price = calculateTotal(item.extra, extra);
  finalItem.id = item.id;
  console.log("NAME: " + item.extra.variations.items[extra.variations].name);
  console.log(extra.variations);
  finalItem.name = item.extra.variations.items[extra.variations].name;
  finalItem.extra = extra;
  //SUBJECT TO CHANGE!!!!!!
  finalItem.amount = amount;
  //!!!!!
  console.log(finalItem);

  currentOrder = addOrIncrease(currentOrder, finalItem);
  console.log("Current order is:");
  console.log(currentOrder);
  let mutability = true;
  renderOrderList(
    document.getElementById("chosen-items"),
    currentOrder,
    mutability
  );
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

async function sendOrder(tableID) {
  console.log("Sending order to table: ", tableID);
  const existingOrder = await fetch(`/api/get-table-order/${tableID}`).then(
    (response) => response.json()
  );
  let newOrder;
  console.log(existingOrder);
  if (existingOrder.order) {
    newOrder = existingOrder.order;
    currentOrder.forEach((item) => {
      addOrIncrease(newOrder, item);
    });
  } else {
    newOrder = currentOrder;
  }
  console.log(newOrder);

  currentOrder = [];
  console.log("current order:");
  console.log(currentOrder);
  let mutability = true;
  renderOrderList(
    document.getElementById("chosen-items"),
    currentOrder,
    mutability
  );
  mutability = false;
  renderOrderList(
    document.getElementById("current-order"),
    newOrder,
    mutability
  );
  getPrice(tableID);

  await sendingTheOrder(tableID, newOrder);
  await sendPrintRequest(newOrder);
}

async function sendPrintRequest(order) {
  const sending = await fetch(`/api/post-print-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Server Response: ", data);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
}

async function sendingTheOrder(tableID, newOrder) {
  const sending = await fetch(`/api/post-order/${tableID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newOrder),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Server response:", data);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}

async function getPrice(tableID) {
  const order = await fetch(`/api/get-table-order/${tableID}`).then(
    (response) => response.json()
  );
  let total = 0;

  order.order.forEach((item) => {
    total += item.price;
  });
  console.log("Total Price: " + total);

  return total;
}

//event listeners:
document.getElementById("value-1").addEventListener("change", async () => {
  await changeMenuSection("BAR");
});

document.getElementById("value-2").addEventListener("change", async () => {
  await changeMenuSection("KITCHEN");
});

//On-load events
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const tableID = params.get("id");
  console.log("SUCCSESS");
  console.log(tableID);

  document.getElementById("order-send").onclick = () => sendOrder(tableID);
  getOrder(tableID);
  getInfo(tableID);

  const price = await getPrice(tableID);
  const rouncedPrice = (price * 1.1).toFixed(2);

  document.getElementById("total-price").textContent =
    "סכום החשבון: " + rouncedPrice + "₪";
  document.getElementById("tip-value").textContent =
    "טיפ: " + (rouncedPrice * 1.1 - rouncedPrice).toFixed(2) + "₪";

  document.getElementById("print-bill").onclick = async () => {
    await renderBillPopup(tableID);
  };
});
