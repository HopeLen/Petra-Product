async function getPrinterList() {
  const list = await fetch(`/api/get-printer-names-TEST`).then((res) =>
    res.json()
  );

  return list;
}

function createList(list) {
  console.log(list);

  list.forEach((item, index) => {
    console.log("Item number " + index + ":", item);
    const container = document.getElementById("main");

    const button = document.createElement("button");

    button.id = item.name;
    button.classList.add("button");
    button.textContent = item.name;

    button.onclick = () => {
      sendPrintRequest(item);
    };
    container.appendChild(button);
  });

  const container = document.getElementById("main");

  const button = document.createElement("button");

  button.id = "all";
  button.classList.add("button");
  button.textContent = "Print on all";

  button.onclick = () => {
    list.forEach((item) => {
      sendPrintRequest(item);
    });
  };
  container.appendChild(button);
}

async function sendPrintRequest(item) {
  console.log("Printing:", item);

  await fetch(`/api/post-print-request-test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then((res) => res.json)
    .then((status) => console.log(status));
}

document.addEventListener("DOMContentLoaded", async () => {
  createList(await getPrinterList());
});
