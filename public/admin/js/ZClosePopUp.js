import scripts from "./scripts.js";

function createPopup() {
  let popupNode = document.getElementById("popup");
  let overlay = document.getElementById("overlay");

  function openPopup() {
    popupNode.classList.add("active");
  }

  overlay.addEventListener("click", closePopup);

  openPopup();
}

function closePopup() {
  let popupNode = document.getElementById("popup");
  popupNode.classList.remove("active");
  document.getElementById("info").innerHTML = "";
  document.getElementById("send").textContent = "שלח";
  document.getElementById("send").onclick = () => {};

  if (document.getElementById("rmv-btn")) {
    document.getElementById("rmv-btn").remove();
  }
}

function checkInput() {
  const cash = document.getElementById("מזומן");
  const card = document.getElementById("אשראי");

  if (cash.value || card.value) {
    return true;
  }
  return false;
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

function createInput(id) {
  const input = document.createElement("input");
  let placeholder;

  if (id === "cash") {
    placeholder = "מזומן";
  } else {
    placeholder = "אשראי";
  }

  input.placeholder = placeholder;

  input.type = "number";
  input.inputmode = "numeric";
  input.id = placeholder;

  return input;
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
  payBox.classList.add("pay-box");

  const totalPrice = document.createElement("h3");
  totalPrice.textContent =
    "לתשלום: " +
    Math.round(
      scripts.helpers.getOrderTotal(card.order) * card.information.percent,
    ) +
    "₪";
  payBox.appendChild(totalPrice);

  const tip = document.createElement("h4");
  tip.textContent =
    "טיפ: " +
    String(
      Math.round(
        scripts.helpers.getOrderTotal(card.order) * card.information.percent -
          scripts.helpers.getOrderTotal(card.order),
      ),
    ) +
    "₪";
  payBox.appendChild(tip);

  payBox.appendChild(createInput("cash"));
  payBox.appendChild(createInput("card"));

  content.appendChild(payBox);
  //-----------------------------------------------
  let sendButton = document.getElementById("send");

  sendButton.onclick = () => {
    const cashPay = document.getElementById("מזומן");
    const cardPay = document.getElementById("אשראי");

    if (checkInput()) {
      scripts.routes.sendPaymentInformation(
        card.orderID,
        cashPay.value,
        cardPay.value,
        getOrderTotal(card.order),
      );
      scripts.routes.setOrderStatus(card.orderID, "FINISHED");
      scripts.display.displayZClose("Z סגירת");
      closePopup();
    } else {
      alert("לא רשמת כלום...");
      return;
    }
  };
}

async function ZClosePopUp(card) {
  console.log("This is the card: ", card);
  createPopup();

  fixPopup(card);
}

export default { ZClosePopUp, createPopup, closePopup };
