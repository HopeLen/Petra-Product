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

async function getTablesFromSection(sectionId) {
  return await fetch(`/api/get-tables-from-section/${sectionId}`).then((res) =>
    res.json(),
  );
}

async function getTableSections() {
  return await fetch("/api/get-table-sections").then((res) => res.json());
}
async function getTableSectionsMap() {
  return await fetch("/api/get-table-section-map").then((res) => res.json());
}

async function fetchTables(id) {
  return await fetch(`/api/get-tables-from-section/${id}`).then((res) =>
    res.json(),
  );
}

async function updateTableShape(tableID, shape) {
  return await fetch(`/api/table-shape/${tableID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shape: shape,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
}

async function deleteTable(id) {
  fetch(`/api/delete-table/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return response.json();
    })
    .then((data) => {
      console.log("User deleted:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function addTable(table) {
  try {
    const response = await fetch("/api/add-table", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(table),
    });

    if (!response.ok) {
      console.log("Something went WRONG");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Create table failed:", error);
  }
}

export default {
  userAdmin,
  getLogo,
  getAwaitingTables,
  sendPaymentInformation,
  setOrderStatus,
  getTablesFromSection,
  getTableSections,
  getTableSectionsMap,
  fetchTables,
  updateTableShape,
  deleteTable,
  addTable,
};
