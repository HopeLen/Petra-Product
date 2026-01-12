import scripts from "./scripts.js";

function getOrderTotal(order) {
  let total = 0;
  order.forEach((item) => {
    total += item.price * item.amount;
  });
  return total;
}

export default { getOrderTotal };
