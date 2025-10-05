import * as invModel from "../models/inventory-model.js";
import { buildVehicleDetailView, buildClassificationList } from "../utilities/index.js";

// --- Management view ---
export async function buildManagement(req, res, next) {
  try {
    const messages = req.flash("message");
    res.render("inventory/management", {
      title: "Inventory Management",
      messages,
    });
  } catch (err) {
    next(err);
  }
}

// --- Add Classification form view ---
export async function buildAddClassification(req, res, next) {
  try {
    const messages = req.flash("message");
    res.render("inventory/add-classification", {
      title: "Add Classification",
      messages,
    });
  } catch (err) {
    next(err);
  }
}

// --- Add Classification POST ---
export async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;

    if (!classification_name || !/^[a-zA-Z0-9]+$/.test(classification_name)) {
      req.flash("message", "Invalid classification name. No spaces or special characters allowed.");
      return res.redirect("/inv/add-classification");
    }

    await invModel.insertClassification(classification_name);
    req.flash("message", `Classification "${classification_name}" added successfully!`);
    res.redirect("/inv");
  } catch (err) {
    next(err);
  }
}

// --- Add Inventory form view ---
export async function buildAddInventory(req, res, next) {
  try {
    const classificationList = await buildClassificationList();
    const messages = req.flash("message");
    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      classificationList,
      messages,
      formData: {}, // пустой объект для "sticky" формы
    });
  } catch (err) {
    next(err);
  }
}

// --- Add Inventory POST ---
export async function addInventory(req, res, next) {
  try {
    const data = req.body;

    // Простейшая проверка полей
    const requiredFields = ["inv_make", "inv_model", "inv_year", "inv_price", "classification_id"];
    for (const field of requiredFields) {
      if (!data[field]) {
        req.flash("message", `Field ${field} is required.`);
        return res.redirect("/inv/add-inventory");
      }
    }

    await invModel.insertInventory(data);
    req.flash("message", `Inventory item "${data.inv_make} ${data.inv_model}" added successfully!`);
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

    const vehicleHTML = buildVehicleDetailView(vehicleData);

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      content: vehicleHTML,
    });
  } catch (err) {
    next(err);
  }
}
