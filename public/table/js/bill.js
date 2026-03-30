function createBillPopup() {
  let popUp = document.getElementById("popup");
  let overlay = document.getElementById("overlay");

  popUp.classList.add("active");

  document.getElementById("send").onclick = () => {
    sendBillPrintRequest();
    closeBillPopup();
  };

  overlay.addEventListener("click", closeBillPopup);
}

function closeBillPopup() {
  document.getElementById("popup").classList.remove("active");
  document.getElementById("comment").value = "";
  document.getElementById("amount").value = 1;

  if (document.getElementById("button-rmv")) {
    document.getElementById("button-rmv").remove();
  }
}

function selectTenPercent() {
  document.getElementById("bill_options-2").checked = true;
}

async function sendPrintRequest(options) {
  console.log(options);
  const sedning = await fetch(`/api/post-print-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Server Response: ", data);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
}

function convertToNum(chosen, options) {
  return (
    1 +
    Number(
      options.bill_options.items[chosen.bill_options].name.replace("%", ""),
    ) /
      100
  );
}

async function renderBillPopup(
  tableID,
  printer = { id: 1, name: "OUT", address: "192.168.10.59" },
) {
  createBillPopup();
  const tranlationResponse = await fetch("/api/get-translation-map");
  const tranlation = await tranlationResponse.json();

  const bill_options = await fetch(`/api/get-bill-options`).then((response) =>
    response.json(),
  );
  console.log(tranlation);
  console.log("bill options: ", bill_options);
  const title = document.getElementById("item-title");
  const options = document.getElementById("options");

  title.innerHTML = "";
  options.innerHTML = "";

  Object.keys(bill_options).forEach((key) => {
    const div = document.createElement("div");
    div.id = key;
    div.classList.add("option-box");
    options.appendChild(div);
    //console.log(div);
    //console.log(item.extra[key].items);

    createList(
      key,
      tranlation[key],
      bill_options[key].items,
      bill_options[key].type,
    );
  });

  await delay(100);
  selectTenPercent();

  document.getElementById("send").textContent = "הדפס חשבון";
  document.getElementById("send").onclick = async () => {
    const type = "bill";
    const percent = convertToNum(getAllInputs(), bill_options);

    const waiterID = 1; //TO CHANGE
    const time = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const date = new Date().toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const items = await getOrder(tableID);

    const options = {
      printer: printer,
      type: type,
      percent: percent,
      waiterID: waiterID,
      tableID: tableID,
      time: time,
      date: date,
      items: items,
    };

    console.log(options);

    sendPrintRequest(options);
    closeBillPopup();
    tableStatusChange(tableID, "BILLED");

    orderStatusChange(await getOrderID(tableID), "BILLED", percent);
  };
}
