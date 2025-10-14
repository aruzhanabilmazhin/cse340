import * as invModel from "../models/inventory-model.js";
import { buildClassificationList, getNav } from "../utilities/index.js";

// --- Inventory Management Page ---
export async function buildInventoryManagement(req, res, next) {
  try {
    const inventory = await invModel.getInventory(); // список всех автомобилей
    const classifications = await invModel.getClassifications(); // список всех классификаций

    res.render("inventory/index", {
      title: "Inventory Management",
      inventory,
      classifications,
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
    const { classification_name } = req.body;
    const result = await invModel.insertClassification(classification_name);
    if (result) {
      req.flash("message", "Classification added successfully");
      res.redirect("/inv");
    } else {
      req.flash("message", "Failed to add classification");
      res.redirect("/inv/add-classification");
    }
  } catch (err) {
    next(err);
  }
}

// --- Add Inventory ---
export async function buildAddInventory(req, res, next) {
  try {
    const classifications = await invModel.getClassifications();
    const classificationList = await buildClassificationList();

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classifications,
      classificationList,
      message: req.flash("message"),
      formData: {}, // пустой объект для stickiness
    });
  } catch (err) {
    next(err);
  }
}

export async function addInventory(req, res, next) {
  try {
    const data = req.body;
    const newVehicle = await invModel.insertInventory(data);
    if (newVehicle) {
      req.flash("message", "Vehicle added successfully");
      res.redirect("/inv");
    } else {
      req.flash("message", "Failed to add vehicle");
      res.redirect("/inv/add-inventory");
    }
  } catch (err) {
    next(err);
  }
}

// --- Vehicle Detail View ---
export async function buildByVehicleId(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const vehicleData = await invModel.getVehicleById(invId);

    if (!vehicleData) {
      return res.status(404).render("errors/404", { message: "Vehicle not found" });
    }

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicle: vehicleData,
    });
  } catch (err) {
    next(err);
  }
}

// ✅ --- NEW: Cars Page ---
export async function buildAllCars(req, res, next) {
  try {
    const nav = await getNav();
    const vehicles = await invModel.getAllVehicles(); // новая функция в модели
    res.render("inventory/list", {
      title: "All Cars",
      nav,
      vehicles,
    });
  } catch (error) {
    console.error("Error loading cars:", error);
    next(error);
  }
}
