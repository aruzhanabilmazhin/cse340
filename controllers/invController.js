import * as invModel from "../models/inventory-model.js";
import { buildVehicleDetailView, buildClassificationList } from "../utilities/index.js";

// --- Vehicle detail view ---
export async function buildByVehicleId(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const vehicleData = await invModel.getVehicleById(invId);

    if (!vehicleData) {
      return res.status(404).render("404", { message: "Vehicle not found" });
    }

    const vehicleHTML = buildVehicleDetailView(vehicleData);

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      content: vehicleHTML,
    });
  } catch (err) {
    next(err);
  }
}

// --- Management view ---
export async function buildManagementView(req, res, next) {
  try {
    res.render("inventory/management", {
      title: "Inventory Management",
      message: req.flash("message") || null,
    });
  } catch (err) {
    next(err);
  }
}

// --- Add Classification view ---
export async function buildAddClassificationView(req, res, next) {
  try {
    res.render("inventory/add-classification", {
      title: "Add Classification",
      errors: null,
      message: req.flash("message") || null,
    });
  } catch (err) {
    next(err);
  }
}

// --- Add Classification POST ---
export async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;

    // Server-side validation
    if (!classification_name || !/^[A-Za-z0-9]+$/.test(classification_name)) {
      return res.render("inventory/add-classification", {
        title: "Add Classification",
        errors: ["Invalid classification name (no spaces or special characters)"],
        message: null,
      });
    }

    await invModel.insertClassification(classification_name);
    req.flash("message", "Classification added successfully!");
    res.redirect("/inv/");
  } catch (err) {
    next(err);
  }
}

// --- Add Inventory view ---
export async function buildAddInventoryView(req, res, next) {
  try {
    const classifications = await invModel.getClassifications();
    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      classifications,
      errors: null,
      message: req.flash("message") || null,
    });
  } catch (err) {
    next(err);
  }
}

// --- Add Inventory POST ---
export async function addInventory(req, res, next) {
  try {
    const { inv_make, inv_model, inv_year, inv_price, classification_id } = req.body;
    const errors = [];

    // Basic server-side validation
    if (!inv_make) errors.push("Make is required");
    if (!inv_model) errors.push("Model is required");
    if (!inv_year) errors.push("Year is required");
    if (!inv_price) errors.push("Price is required");
    if (!classification_id) errors.push("Classification is required");

    if (errors.length) {
      const classifications = await invModel.getClassifications();
      return res.render("inventory/add-inventory", {
        title: "Add Vehicle",
        classifications,
        errors,
        message: null,
      });
    }

    await invModel.insertInventory({ inv_make, inv_model, inv_year, inv_price, classification_id });
    req.flash("message", "Vehicle added successfully!");
    res.redirect("/inv/");
  } catch (err) {
    next(err);
  }
}
