function calculateTotal(info, selected) {
  let total = 0;

  Object.keys(selected).forEach((key) => {
    // Skip fields not related to prices
    if (key === "comment") return;

    const selection = selected[key];
    const infoEntry = info[key];
    console.log(key + " is " + selection);
    //console.log(key + " is " + infoEntry);

    if (!infoEntry || !infoEntry.items) return; // skip invalid keys

    const items = infoEntry.items;

    // Checkbox list (array of indexes)
    if (Array.isArray(selection)) {
      selection.forEach((i) => {
        const item = items[i];
        if (item && item.price) {
          total += item.price;
        }
      });
    }
    // Radio selection (single index)
    else {
      const item = items[selection];
      if (item && item.price) {
        total += item.price;
      }
    }
  });

  return total;
}

function getAllInputs() {
  const result = {};

  // Get all inputs that are either radio or checkbox
  const inputs = document.querySelectorAll(
    'input[type="radio"], input[type="checkbox"]'
  );

  inputs.forEach((input) => {
    const { id, name, type, checked } = input;

    // Skip unchecked radios and checkboxes
    if (!checked || name === "value-radio") return;

    // Extract index from id ("section-index")
    const index = parseInt(id.split("-")[1]);

    if (type === "radio") {
      // Only one selected index per section
      result[name] = index;
    }

    if (type === "checkbox") {
      // Multiple indices per section
      if (!result[name]) result[name] = [];
      result[name].push(index);
    }
  });
  return result;
}

function objectsEqualIgnoringAmount(a, b) {
  const aKeys = Object.keys(a).filter((k) => k !== "amount");
  const bKeys = Object.keys(b).filter((k) => k !== "amount");

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((key) => {
    // If value is another object, compare recursively
    if (typeof a[key] === "object" && a[key] !== null) {
      return objectsEqualIgnoringAmount(a[key], b[key]);
    }
    // Primitive value comparison
    return a[key] === b[key];
  });
}

function addOrIncrease(orders, newItem) {
  const amountToAdd = Number(newItem.amount) || 1;

  for (let item of orders) {
    if (objectsEqualIgnoringAmount(item, newItem)) {
      item.amount += amountToAdd;
      return orders;
    }
  }

  // No match → add new object with its actual amount
  orders.push({ ...newItem, amount: amountToAdd });
  return orders;
}
