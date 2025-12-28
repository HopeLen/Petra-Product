function fixNav() {
  const liElements = document.querySelectorAll("#menu-links li");

  liElements.forEach((item, index) => {
    console.log(item.id, index);

    item.querySelector("span").textContent = item.id;

    item.querySelector("input").value = item.id;

    item.querySelector("input").addEventListener("change", () => {
      select(item);
      //openWindow(item.id);
    });
  });
}

function select(item) {
  const radio = item.querySelector("input");
  console.log(radio.checked);

  const liElements = document.querySelectorAll("#menu-links li");

  liElements.forEach((li) => {
    li.querySelector("label").classList.remove("selected");
  });

  item.querySelector("label").classList.add("selected");
}

export default { fixNav };
