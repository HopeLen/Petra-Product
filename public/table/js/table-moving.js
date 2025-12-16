async function tableMove() {
  const destination = prompt("הזן יעד:");

  const order = await getOrder(tableID);
  console.log(order.order);

  await sendingTheOrder(destination, order.order);
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
}
