async function getOrderID(tableID) {
  const orderID = await fetch(`/api/get-order-id/${tableID}`).then((res) =>
    res.json()
  );
  return orderID[0].information;
}

async function postOrderToInfo(orderID, order) {
  console.log(order);
  const sending = await fetch(`/api/post-order-to-info/${orderID}`, {
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

async function closeOrder(tableID) {
  console.log("Closing the order at: ", tableID);

  const orderID = await getOrderID(tableID);
  console.log("orderID: ", orderID);

  const order = await getOrder(tableID).then((res) => res.order);
  console.log(order);

  await postOrderToInfo(orderID, order);
}
