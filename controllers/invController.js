import * as invModel from "../models/inventory-model.js";
import { buildVehicleDetailView, buildClassificationList } from "../utilities/index.js";

export async function buildInventoryManagement(req, res, next) {
  try {
    const inventory = await invModel.getInventory();
    res.render("inventory/index", { title: "Inventory Management", inventory, message: req.flash("message") });
  } catch (err) { next(err); }
}

export async function buildAddClassification(req, res, next) {
  res.render("inventory/add-classification", { title: "Add Classification", message: req.flash("message") });
}

export async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;
    await invModel.insertClassification(classification_name);
    req.flash("message", "Classification added successfully");
    res.redirect("/inv");
  } catch (err) { next(err); }
}

export async function buildAddInventory(req, res, next) {
  const classificationList = await buildClassificationList();
  res.render("inventory/add-inventory", { title: "Add Inventory", classificationList, message: req.flash("message"), formData: {} });
}

export async function addInventory(req, res, next) {
  try {
    await invModel.insertInventory(req.body);
    req.flash("message", "Vehicle added successfully");
    res.redirect("/inv");
  } catch (err) { next(err); }
}

export async function buildByVehicleId(req, res, next) {
  const vehicleData = await invModel.getVehicleById(parseInt(req.params.invId));
  if (!vehicleData) return res.status(404).render("errors/404", { message: "Vehicle not found" });
  const vehicleHTML = buildVehicleDetailView(vehicleData);
  res.render("inventory/detail", { title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, content: vehicleHTML, vehicle: vehicleData });
}
