import routes from "./routes.js";
import scripts from "./scripts.js";

function getOrderTotal(order) {
  let total = 0;
  order.forEach((item) => {
    total += item.price * item.amount;
  });
  return total;
}

async function createSections(container, grid) {
  const sections = await scripts.routes.getTableSectionsMap();
  console.log(sections);
  sections.forEach((item) => {
    const section = document.createElement("div");
    section.classList.add("section");
    section.textContent = item.name;
    console.log(section);

    section.onclick = () => {
      console.log(item.id, grid);
      renderGrid(item.id, grid);
    };

    container.appendChild(section);
  });
}

async function renderGrid(section_id, grid) {
  grid.innerHTML = "";

  const data = await scripts.routes.getTablesFromSection(section_id);
  console.log(data);

  let maxCol = 5;
  let maxRow = 5;
  data.forEach((row) => {
    const [colNum, rowNum] = row.location.split("-").map(Number);

    if (colNum > maxCol) {
      maxCol = colNum;
    }
    if (rowNum > maxRow) {
      maxRow = rowNum;
    }
  });

  console.log(grid, maxCol, maxRow, section_id);
  createGrid(grid, maxCol, maxRow, section_id);

  data.forEach((row) => {
    const container = document.getElementById(row.location);

    container.textContent = "";
    container.className = "";
    container.classList.add("card");

    if (row.shape == "C") {
      renderCircle(container);
    }

    container.dataset.tableId = row.id;
    container.textContent = row.id;
    container.onclick = () => {
      scripts.ZClosePopUp.createPopup();
      tablesCheckPopup(row);
    };
  });
}

function renderCircle(container) {
  container.style.borderRadius = "50%";
  container.style.width = container.offsetHeight + "px";
  container.style.marginLeft = "auto";
  container.style.marginRight = "auto";
}

function tablesCheckPopup(row = null, location) {
  console.log(row);

  if (row) {
    tablesPopupChange(row);
  } else {
    tablesPopupCreate(location);
  }
}

function tablesPopupChange(row) {
  const title = document.getElementById("title");
  const info = document.getElementById("info");
  const controls = document.getElementById("controls");
  title.innerHTML = "";
  info.innerHTML = "";

  title.textContent = "שולחן: " + row.id;

  createRadioGroup({
    groupName: "shape",
    option1: { label: "מרובע", value: "S" },
    option2: { label: "עיגול", value: "C" },
    container: info,
  });

  const delete_button = createDeleteButton();
  delete_button.onclick = () => {
    if (row.status !== "OPEN") {
      alert("השולחן טפוס!");
      return;
    }

    scripts.routes.deleteTable(row.id);
    scripts.ZClosePopUp.closePopup();
    renderGrid(row.section_id, document.getElementById("tables"));
  };
  controls.appendChild(delete_button);

  document.getElementById("send").textContent = "שמור שינויים";
  document.getElementById("send").onclick = () => {
    const value = getSelectedValue("shape");
    if (!value) {
      alert("לא בחרת כלום...");
      return;
    }

    console.log(value);

    scripts.routes.updateTableShape(row.id, value);
    scripts.ZClosePopUp.closePopup();

    const cell = document.getElementById(row.location);

    if (value === "C") {
      renderCircle(cell);
    } else {
      cell.style.cssText = "";
    }
  };
}

function tablesPopupCreate(location) {
  const title = document.getElementById("title");
  const info = document.getElementById("info");
  title.innerHTML = "";
  info.innerHTML = "";

  title.textContent = "יצירת שולחן חדש";

  createIdInput({
    placeholder: " הכנס ערך",
    className: "id-input-container",
    id: "id-input",
    container: info,
  });

  createRadioGroup({
    groupName: "shape",
    option1: { label: "מרובע", value: "S" },
    option2: { label: "עיגול", value: "C" },
    container: info,
  });

  console.log(location);

  document.getElementById("send").textContent = "שמור שינויים";
  document.getElementById("send").onclick = async () => {
    const shape = getSelectedValue("shape");
    if (!shape) {
      alert("לא בחרת כלום...");
      return;
    }
    const id = document.getElementById("id-input").value;

    const section_id = document.getElementById("tables").dataset.section_id;
    const grid = document.getElementById("tables");

    const new_table = {
      id: id,
      section_id: section_id,
      location: location,
      shape: shape,
    };

    scripts.routes.addTable(new_table);
    renderGrid(section_id, grid);
    scripts.ZClosePopUp.closePopup();
  };
}

function createIdInput({ placeholder, className, id, container }) {
  const input = document.createElement("input");
  const wrapper = document.createElement("div");

  if (placeholder) {
    input.placeholder = placeholder;
  }

  if (className) {
    input.className = className;
  }

  if (id) {
    input.id = id;
  }

  wrapper.className = "input-container";

  wrapper.appendChild(input);
  if (container) {
    container.appendChild(wrapper);
  } else {
    return wrapper;
  }
}

function getSelectedValue(groupName) {
  const selected = document.querySelector(`input[name="${groupName}"]:checked`);
  return selected ? selected.value : null;
}

function createDeleteButton() {
  const button = document.createElement("button");
  button.classList.add("submit-btn");
  button.style.backgroundColor = "red";
  button.textContent = "מחק שולחן";
  button.id = "rmv-btn";
  return button;
}

function createRadioGroup({
  groupName,
  option1 = { label: "Option 1", value: "1" },
  option2 = { label: "Option 2", value: "2" },
  container = null,
}) {
  // Wrapper div
  const wrapper = document.createElement("div");

  // Helper to create a radio option
  function createRadio(option) {
    const label = document.createElement("label");
    label.style.marginRight = "10px";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = groupName; // same name = same group
    input.value = option.value;

    label.appendChild(document.createTextNode(option.label + " "));
    label.appendChild(input);

    return label;
  }

  wrapper.appendChild(createRadio(option1));
  wrapper.appendChild(createRadio(option2));

  if (container) {
    container.appendChild(wrapper);
  }

  wrapper.classList.add("input-container");
  return wrapper;
}

function createGrid(grid, cols, rows, section_id) {
  grid.innerHTML = ""; // clear previous cells
  grid.style.setProperty("--cols", cols);
  grid.style.setProperty("--rows", rows);
  grid.dataset.section_id = section_id;

  for (let y = rows; y >= 1; y--) {
    for (let x = 1; x <= cols; x++) {
      const cell = document.createElement("div");
      cell.classList.add("card");
      cell.id = `${x}-${y}`;
      cell.dataset.section_id = section_id;
      cell.onclick = () => {
        scripts.ZClosePopUp.createPopup();
        tablesCheckPopup(null, `${x}-${y}`);
      };
      grid.appendChild(cell);
    }
  }
}

async function createWaiterList(list_container, editor_container) {
  list_container.innerHTML = "";

  scripts.display.title("מלצרים", list_container, "div");

  const waiters = await scripts.routes.getWaiters();

  console.log(waiters);

  const waiterContainer = document.createElement("div");
  waiterContainer.classList.add("waiter-list");
  list_container.appendChild(waiterContainer);

  waiters.forEach((item) => {
    const waiter = document.createElement("div");
    waiter.classList.add("waiter");
    waiter.textContent = item.name;
    waiter.id = item.id;
    waiterContainer.appendChild(waiter);

    waiter.onclick = () => {
      console.log(item);

      createWaiterEditor(item, editor_container);
    };
  });

  const addWaiter = document.createElement("div");
  addWaiter.classList.add("waiter");
  addWaiter.classList.add("waiter-add");
  addWaiter.textContent = "הוסף מלצר";
  addWaiter.onclick = () => {
    const waiter = { id: "new", name: "", admin: 0 };
    createWaiterEditor(waiter, editor_container);
  };

  list_container.appendChild(addWaiter);
}

function createWaiterEditor(waiter, container) {
  container.innerHTML = "";

  container.appendChild(createWaiterNamer(waiter));
  container.appendChild(createWaiterPrivilege(waiter));
  container.appendChild(createWaiterControls(waiter));
}

function createWaiterNamer(waiter) {
  const container = document.createElement("div");
  container.classList.add("waiter-editor-container");

  const title = document.createElement("h3");
  title.textContent = ":שם";

  const input = document.createElement("input");
  input.classList.add("waiter-name-input");
  input.value = waiter.name;
  input.dir = "rtl";
  input.id = "waiter-namer";

  container.appendChild(title);
  container.appendChild(input);
  return container;
}

function createWaiterPrivilege(waiter) {
  const container = document.createElement("div");
  container.classList.add("waiter-editor-container");

  const title = document.createElement("h3");
  title.textContent = ":פריבילגיות";

  const inputBox = document.createElement("div");
  inputBox.appendChild(createWaiterPrivilegesListItem(waiter));

  container.appendChild(title);
  container.appendChild(inputBox);
  return container;
}

function createWaiterPrivilegesListItem(waiter) {
  const container = document.createElement("label"); // clickable label wrapper
  const labelText = "הכל";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "privileges";
  checkbox.id = "admin";
  if (waiter.admin) {
    checkbox.checked = true;
  }
  // Add checkbox + text to label
  container.appendChild(document.createTextNode(labelText + " "));
  container.appendChild(checkbox);

  return container;
}

function createWaiterControls(waiter) {
  const container = document.createElement("div");
  container.classList.add("waiter-controls");

  const send = document.createElement("button");
  send.classList.add("waiter-button");
  send.textContent = "שמור שינויים";
  send.onclick = () => {
    const admin = document.getElementById("admin").checked;
    const name = document.getElementById("waiter-namer").value;

    console.log(admin, name);

    if (waiter.id != "new") {
      scripts.routes.updateWaiter({
        id: waiter.id,
        name: name,
        admin: Number(admin),
      });
      document.getElementById(waiter.id).textContent = name;

      createWaiterList(
        document.getElementById("waiter-list"),
        document.getElementById("waiter-editor"),
      );

      return;
    }

    scripts.routes.createWaiter({ name: name, admin: Number(admin) });
    createWaiterList(
      document.getElementById("waiter-list"),
      document.getElementById("waiter-editor"),
    );
  };

  const dismiss = document.createElement("button");
  dismiss.classList.add("waiter-button");
  dismiss.classList.add("dismiss");
  dismiss.textContent = "בטל שינויים";
  dismiss.onclick = () => {
    createWaiterEditor(waiter, document.getElementById("waiter-editor"));
  };

  container.appendChild(send);
  container.appendChild(dismiss);
  return container;
}

export default {
  getOrderTotal,
  createSections,
  createGrid,
  renderGrid,
  createWaiterList,
};
