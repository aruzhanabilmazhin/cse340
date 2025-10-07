import { buildVehicleDetailView, buildClassificationList } from "../utilities/index.js";

// --- Inventory Management Page ---
export async function buildInventoryManagement(req, res, next) {
  try {
    // Temporary test data instead of DB call
    const classifications = [
      { classification_id: 1, classification_name: "SUV" },
      { classification_id: 2, classification_name: "Sedan" },
    ];

    // Temporary test inventory
    const inventory = [
      { inv_id: 1, inv_make: "Toyota", inv_model: "RAV4", inv_year: 2022, inv_price: 30000 },
      { inv_id: 2, inv_make: "Honda", inv_model: "Civic", inv_year: 2021, inv_price: 22000 },
      { inv_id: 3, inv_make: "Ford", inv_model: "Explorer", inv_year: 2023, inv_price: 45000 },
    ];

    res.render("inventory/index", {
      title: "Inventory Management",
      classifications,
      inventory,         // <-- добавили переменную для EJS
      message: req.flash("message"),
    });
  } catch (err) {
    next(err);
  }
}

// --- Add Classification ---
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
    // Fake success
    req.flash("message", "Classification added successfully");
    res.redirect("/inv");
  } catch (err) {
    next(err);
  }
}

// --- Add Inventory ---
export async function buildAddInventory(req, res, next) {
  try {
    const classifications = [
      { classification_id: 1, classification_name: "SUV" },
      { classification_id: 2, classification_name: "Sedan" },
    ];

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classifications,
      message: req.flash("message"),
    });
  } catch (err) {
    next(err);
  }
}

export async function addInventory(req, res, next) {
  try {
    // Fake success
    req.flash("message", "Vehicle added successfully");
    res.redirect("/inv");
  } catch (err) {
    next(err);
  }
}

// --- Vehicle Detail View ---
export async function buildByVehicleId(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);

    // Temporary test data
    const vehicleData = {
      inv_id: invId,
      inv_make: "Toyota",
      inv_model: "Camry",
      inv_year: 2023,
      inv_price: 35000,
    };

    const vehicleHTML = buildVehicleDetailView(vehicleData);

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      content: vehicleHTML,
      vehicle: vehicleData,
    });
  } catch (err) {
    next(err);
  }
}
