// Временный "мок" модели, без базы
let classifications = [
  { classification_id: 1, classification_name: "SUV" },
  { classification_id: 2, classification_name: "Sedan" },
];

let inventory = [
  {
    inv_id: 1,
    inv_make: "Toyota",
    inv_model: "Camry",
    inv_year: 2023,
    inv_price: 25000,
    classification_id: 2,
    classification_name: "Sedan",
    inv_miles: 12000,
    inv_image: "/images/no-image.png",
    inv_description: "A nice car"
  }
];

export async function getClassifications() {
  return classifications;
}

export async function insertClassification(name) {
  const newId = classifications.length + 1;
  classifications.push({ classification_id: newId, classification_name: name });
  return { rowCount: 1 };
}

export async function getInventory() {
  return inventory;
}

export async function insertInventory(data) {
  const newId = inventory.length + 1;
  const classObj = classifications.find(c => c.classification_id == data.classification_id);
  inventory.push({
    inv_id: newId,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_price: data.inv_price,
    classification_id: data.classification_id,
    classification_name: classObj ? classObj.classification_name : "",
    inv_miles: data.inv_miles || 0,
    inv_image: data.inv_image || "/images/no-image.png",
    inv_description: data.inv_description || ""
  });
  return true;
}

export async function getVehicleById(invId) {
  return inventory.find(v => v.inv_id === invId);
}
