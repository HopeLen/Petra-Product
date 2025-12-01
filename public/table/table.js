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
    console.log(menuItem);
    console.log(item);
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


async function getMenu() {
  
}




document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tableID = params.get("id");
  console.log("SUCCSESS");
  console.log(tableID);

  getOrder(tableID);
  getInfo(tableID);
  getMenu()
});
