function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendRequest() {
  const input = document.getElementById("amount").value;
  console.log(input);

  for (i = 0; i < input; i++) {
    console.log("sent");
    await printQR();
    await delay(200);
  }
}

async function printQR() {
  await fetch(`/api/send-qr-print`);
}
