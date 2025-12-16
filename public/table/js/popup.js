function activatePopup(item) {
  let popUp = document.getElementById("popup");
  let overlay = document.getElementById("overlay");

  popUp.classList.add("active");

  document.getElementById("send").onclick = () => {
    addComplexItem(item);
    renderOrderList(document.getElementById("chosen-items"), currentOrder);
    closePopup();
  };

  overlay.addEventListener("click", closePopup);
}

function closePopup() {
  document.getElementById("popup").classList.remove("active");
  document.getElementById("comment").value = "";
  document.getElementById("amount").value = 1;
  document.getElementById("options").innerHTML = "";
  if (document.getElementById("button-rmv")) {
    document.getElementById("button-rmv").remove();
  }
}

function createList(containerId, name, items, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  container.appendChild(createBoxTitle(name));

  items.forEach((item, index) => {
    const id = `${containerId}-${index}`;

    const wrapper = document.createElement("label");
    wrapper.style.display = "block";

    const checked = type === "radio" && index === 0 ? "checked" : "";

    wrapper.innerHTML = `
      <input type="${type}" name="${containerId}" id="${id}" value="${
      item.name
    }" ${checked}>
      ${item.name} ${item.price ? `(${item.price}₪)` : ""}
    `;
    wrapper.classList.add("choose-list-item");

    container.appendChild(wrapper);
  });
}

function fixPopupFromItem(item, index, infoItem, mutability) {
  console.log("FIXING NOW");
  // Loop over each category in the item's extra
  if (requiresPopup(infoItem)) {
    console.log(item);
    Object.keys(item.extra).forEach((key) => {
      const extraData = item.extra[key];

      if (Array.isArray(extraData)) {
        extraData.forEach((index) => {
          //console.log("EXTRA DATA IN INDEX:" + extraData[index]);
          const inputId = `${key}-${index}`;
          //console.log(inputId);
          const inputElement = document.getElementById(inputId);
          if (inputElement) {
            inputElement.checked = true;
          }
        });
      } else {
        const inputId = `${key}-${extraData}`;
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
          inputElement.checked = true;
        }
      }
    });
  }

  document.getElementById("amount").value = item.amount;

  try {
    console.log(item.extra.comment);
    document.getElementById("comment").value = item.extra.comment;
  } catch (err) {}

  console.log("Index: " + index);
  console.log("Item: ");
  console.log(item);
  console.log("Mutability is: " + mutability);
  if (mutability) {
    document.getElementById("send").onclick = () => {
      removeItem(index);

      if (requiresPopup(infoItem)) {
        console.log("Remaking a complex item");
        addComplexItem(infoItem);
      } else {
        addSimpleItem(infoItem);
      }

      closePopup();
    };
  } else {
    disableOrEnableInputs(!mutability);
    document.getElementById("send").onclick = () => {
      disableOrEnableInputs(mutability);
      closePopup();
    };
    document
      .getElementById("overlay")
      .addEventListener("click", () => disableOrEnableInputs(mutability));
  }

  createRmvButton(index, mutability);
}

function disableOrEnableInputs(mutability) {
  document
    .querySelectorAll(
      'input[type="radio"], input[type="checkbox"], input[type="text"], input[type="number"'
    )
    .forEach((i) => (i.disabled = mutability));
}

function removeItem(index) {
  console.log("This is the removeItem function");
  console.log("Removing: " + index);
  currentOrder.splice(index, 1);
}

function createRmvButton(index, mutability) {
  const controls = document.getElementById("controls");
  const button = document.createElement("button");

  button.classList.add("button");
  button.classList.add("button-rmv");
  button.id = "button-rmv";
  button.textContent = "להוריד פריט";

  controls.appendChild(button);

  if (mutability) {
    button.onclick = () => {
      removeItem(index);
      closePopup();
      renderOrderList(document.getElementById("chosen-items"), currentOrder);
      disableOrEnableInputs(mutability);
    };
  } else {
    button.onclick = async () => {
      const waiterID = prompt("הכנס קוד:");
      const adminResponse = await fetch(
        `/api/get-admin-privileges/${waiterID}`
      ).then((res) => res.json());
      const admin = adminResponse[0].admin;

      console.log(admin);

      if (!admin) {
        alert("אין לך זכויות!");
        closePopup();
        return;
      }

      console.log("We have continued!");

      const order = await getOrder(tableID);
      console.log(order);
      console.log("The one above is the one I want");

      order.order.splice(index, 1);
      console.log(order);

      sendingTheOrder(tableID, order.order);
      renderOrderList(
        document.getElementById("current-order"),
        order.order,
        mutability
      );
      disableOrEnableInputs(mutability);
      closePopup();
    };
  }
}

function createBoxTitle(name) {
  const title = document.createElement("h3");

  title.textContent = name + ":";

  return title;
}
