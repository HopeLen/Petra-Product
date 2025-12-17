async function tableMove() {
  const destination = prompt("הזן יעד:");

  const order = await getOrder(tableID);
  console.log(order.order);

  const response = await sendingTheOrder(destination, order.order);
  if (response) {
    console.log("Nullifying...");
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
  } else {
    alert("אין שולחן כזה");
  }
}
