import * as invModel from "../models/inventory-model.js";

// --- Management page ---
export async function buildManagementView(req, res, next) {
  try {
    const message = req.flash("message");
    res.render("inventory/management", { title: "Inventory Management", message });
  } catch (err) {
    next(err);
  }
}

// --- Add classification view ---
export async function buildAddClassificationView(req, res, next) {
  try {
    const message = req.flash("message");
    res.render("inventory/add-classification", { title: "Add Classification", message });
  } catch (err) {
    next(err);
  }
}

// --- Insert classification ---
export async function insertClassification(req, res, next) {
  try {
    const { classification_name } = req.body;
    if (!classification_name || /[^a-zA-Z0-9]/.test(classification_name)) {
      req.flash("message", "Invalid classification name.");
      return res.redirect("/inv/add-classification");
    }

    await invModel.insertClassification(classification_name);
    req.flash("message", "Classification added successfully!");
    res.redirect("/inv");
  } catch (err) {
    next(err);
  }
}

// --- Add inventory view ---
export async function buildAddInventoryView(req, res, next) {
  try {
    const classifications = await invModel.getClassifications();
    const message = req.flash("message");
    res.render("inventory/add-inventory", { title: "Add Vehicle", classifications, message });
  } catch (err) {
    next(err);
  }
}

// --- Insert inventory ---
export async function insertInventory(req, res, next) {
  try {
    const { inv_make, inv_model, inv_year, inv_price, classification_id } = req.body;

    if (!inv_make || !inv_model || !inv_year || !inv_price || !classification_id) {
      req.flash("message", "All fields are required.");
      return res.redirect("/inv/add-inventory");
    }

    const data = { inv_make, inv_model, inv_year: parseInt(inv_year), inv_price: parseFloat(inv_price), classification_id };
    await invModel.insertInventory(data);

    req.flash("message", "Vehicle added successfully!");
    res.redirect("/inv");
  } catch (err) {
    next(err);
  }
}

// --- Vehicle detail view ---
export async function buildByVehicleId(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const vehicleData = await invModel.getVehicleById(invId);

    if (!vehicleData) {
      return res.status(404).render("404", { message: "Vehicle not found" });
    }

    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(vehicleData.inv_price);

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicle: {
        make: vehicleData.inv_make,
        model: vehicleData.inv_model,
        year: vehicleData.inv_year,
        image: vehicleData.inv_image,
      },
      formattedPrice,
    });
  } catch (err) {
    next(err);
  }
}
