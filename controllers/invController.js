import { buildClassificationList } from "../utilities/index.js";

// Temporary storage for demo purposes
let classifications = [
  { classification_id: 1, classification_name: "SUV" },
  { classification_id: 2, classification_name: "Sedan" },
];

let inventory = []; // массив для хранения машин

// Inventory Management Page
export async function buildInventoryManagement(req, res, next) {
  try {
    res.render("inventory/index", {
      title: "Inventory Management",
      classifications,
      inventory,
      message: req.flash("message"),
    });
  } catch (err) {
    next(err);
  }
}

// Add Classification
export async function buildAddClassification(req, res, next) {
  try {
    res.render("inventory/add-classification", {
      title: "Add Classification",
      message: req.flash("message"),
    });
  } catch (err) {
    next(err);
  }
}

export async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;
    const newId = classifications.length + 1;
    classifications.push({ classification_id: newId, classification_name });
    req.flash("message", "Classification added successfully");
    res.redirect("/inv");
  } catch (err) {
    next(err);
  }
}

// Add Inventory
export async function buildAddInventory(req, res, next) {
  try {
    const classificationList = await buildClassificationList(classifications);
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationList,
      formData: {},
      message: req.flash("message"),
    });
  } catch (err) {
    next(err);
  }
}

export async function addInventory(req, res, next) {
  try {
    const { inv_make, inv_model, inv_year, inv_price, classification_id } = req.body;
    inventory.push({
      id: inventory.length + 1,
      make: inv_make,
      model: inv_model,
      year: inv_year,
      price: inv_price,
      classification_id,
    });
    req.flash("message", "Vehicle added successfully");
    res.redirect("/inv");
  } catch (err) {
    next(err);
  }
}
