async function userAdmin() {
  const waiterID = prompt("הכנס קוד:");
  const admin = await fetch(`/api/get-admin-privileges/${waiterID}`)
    .then((res) => res.json())
    .then((res) => res[0].admin);
  console.log(admin);
  return admin;
}

async function getLogo() {
  return await fetch(`api/get-logo`);
}

async function getAwaitingTables() {
  return await fetch(`/api/get-awaiting-tables`).then((res) => res.json());
}

async function sendPaymentInformation(orderID, cash, card, total) {
  console.log(orderID, cash, card);
  await fetch(`/api/post-payment-info/${orderID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cash: cash, card: card, total: total }),
  });
}

async function setOrderStatus(orderID, targetStatus) {
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

export default {
  userAdmin,
  getLogo,
  getAwaitingTables,
  sendPaymentInformation,
  setOrderStatus,
};
