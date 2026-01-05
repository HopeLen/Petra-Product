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

export default { userAdmin, getLogo, getAwaitingTables };
