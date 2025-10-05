import * as invModel from "../models/inventory-model.js";
import { buildVehicleDetailView, buildClassificationList } from "../utilities/index.js";

// --- Vehicle detail view (текущая функция) ---
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

// --- Task 1: Management View ---
export function buildManagementView(req, res) {
  const message = req.flash("message");
  res.render("inventory/management", {
    title: "Inventory Management",
    message,
  });
}

// --- Task 2: Add Classification ---
export function buildAddClassificationView(req, res) {
  const errors = req.flash("errors");
  res.render("inventory/add-classification", {
    title: "Add Classification",
    errors,
  });
}

export async function addClassification(req, res) {
  try {
    const { classification_name } = req.body;
    await invModel.insertClassification(classification_name);
    req.flash("message", "Classification added successfully!");
    res.redirect("/inv/");
  } catch (error) {
    req.flash("errors", "Failed to add classification.");
    res.redirect("/inv/classification/add");
  }
}

// --- Task 3: Add Inventory ---
export async function buildAddInventoryView(req, res) {
  const errors = req.flash("errors");
  const classifications = await buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    errors,
    classifications,
    old: {}, // для "sticky form", можно передавать предыдущие значения
  });
}

export async function addInventory(req, res) {
  try {
    const inventoryData = req.body;
    await invModel.insertInventory(inventoryData);
    req.flash("message", "Inventory item added successfully!");
    res.redirect("/inv/");
  } catch (error) {
    req.flash("errors", "Failed to add inventory item.");
    res.redirect("/inv/add");
  }
}
