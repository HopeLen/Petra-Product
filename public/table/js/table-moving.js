async function changeOrderInfoTable(orderID, destination) {
  await fetch(`/api/change-info-table/${orderID}/${destination}`);
}

async function userAdmin() {
  const waiterID = prompt("הכנס קוד:");
  const admin = await fetch(`/api/get-admin-privileges/${waiterID}`)
    .then((res) => res.json())
    .then((res) => res[0].admin);
  console.log(admin);
  return admin;
}

async function tableMove() {
  if (await userAdmin()) {
    const destination = prompt("הזן יעד:");

    const order = await getOrder(tableID);
    console.log(order.order);

    if (getTableStatus(tableID) === "OPEN") {
      await sendingTheOrder(destination, order.order);
      console.log("Nullifying...");

      const orderID = await fetch(`/api/get-order-id/${tableID}`)
        .then((res) => res.json())
        .then((res) => res[0])
        .then((res) => res.information);

      console.log(orderID);

      await changeOrderInfoTable(orderID, destination);

      await nullifyOrder(tableID);
      document.getElementById("total-price").textContent = "";
      document.getElementById("tip-value").textContent = "";

      const newOrder = await getOrder(tableID);
      let mutability = false;
      renderOrderList(
        document.getElementById("current-order"),
        newOrder,
        mutability
      );

      await tableStatusChange(destination, "TAKEN");
      await tableStatusChange(tableID, "OPEN");
    } else {
      alert("אין שולחן כזה או שהשולחן תפוס");
    }
  } else {
    alert("אין לך זכויות");
  }
}
