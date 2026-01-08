import scripts from "./scripts.js";

function createPopup() {
  let popupNode = document.getElementById("popup");
  let overlay = document.getElementById("overlay");

  function openPopup() {
    popupNode.classList.add("active");
  }

  function closePopup() {
    popupNode.classList.remove("active");
  }

  overlay.addEventListener("click", closePopup);

  openPopup();
}

function renderOrderList(ul, list, mutability = true) {
  ul.innerHTML = ""; // clear list

  list.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <span>X${item.amount} ${item.name}</span>
    <span>${item.price * item.amount}₪</span>
  `;
    ul.appendChild(li);
  });
}

function getOrderTotal(order) {
  let total = 0;
  order.forEach((item) => {
    total += item.price;
  });
  return total;
}

function fixPopup(card) {
  const title = document.getElementById("title");
  const content = document.getElementById("info");

  title.textContent = "הזמנה מספר: " + card.orderID;

  //order display
  const orderDisplay = document.createElement("ul");
  orderDisplay.id = "order-display";
  orderDisplay.classList.add("order");

  renderOrderList(orderDisplay, card.order, false);

  content.appendChild(orderDisplay);

  //Payment
  const payBox = document.createElement("div");
  payBox.id = "pay-box";

  const totalPrice = document.createElement("h3");
  totalPrice.textContent = "לתשלום: " + getOrderTotal(card.order);
  payBox.appendChild(totalPrice);

  content.appendChild(payBox);
}

async function ZClosePopUp(card) {
  console.log("This is the card: ", card);
  createPopup();

  fixPopup(card);
}

export default { ZClosePopUp };
