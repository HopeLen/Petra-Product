async function getOrderID(tableID) {
  const orderID = await fetch(`/api/get-order-id/${tableID}`).then((res) =>
    res.json()
  );
  return orderID[0].information;
}

async function postOrderToInfo(orderID, order) {
  console.log(order);
  const sending = await fetch(`/api/post-order-to-info/${tableID}/${orderID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Server response:", data);
      console.log("Ok:", data.ok);
      if (data.ok) {
        console.log("Returning true");
        return true;
      } else {
        console.log("Returning false");
        return false;
      }
    })
    .catch((err) => {
      console.error("Error:", err);
    });
  console.log("Sending: ", sending);
  return sending;
}

async function orderStatusChange(orderID, targetStatus) {
  try {
    await fetch("/api/set-order-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderID,
        targetStatus,
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function adminCheck() {
  const waiterID = prompt("הכנס קוד:");
  const adminResponse = await fetch(
    `/api/get-admin-privileges/${waiterID}`
  ).then((res) => res.json());
  const admin = adminResponse[0].admin;

  console.log(admin);
  return admin;
}

async function closeOrder(tableID) {
  const admin = await adminCheck();
  const status = await getTableStatus(tableID);
  console.log(status);

  if (status !== "BILLED") {
    alert("השולחן לא בחשבון!");
    return;
  }

  if (!admin) {
    alert("אין לך זכויות!");
    return;
  }

  console.log("Closing the order at: ", tableID);

  const orderID = await getOrderID(tableID);
  console.log("orderID: ", orderID);

  const order = await getOrder(tableID).then((res) => res.order);
  console.log(order);

  await postOrderToInfo(orderID, order);
  await tableStatusChange(tableID, "OPEN");
  await orderStatusChange(orderID, "AWAITING");
}
