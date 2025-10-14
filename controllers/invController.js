// controllers/invController.js
import * as invModel from "../models/inventory-model.js"
import { buildClassificationList, getNav } from "../utilities/index.js"

// --- Inventory Management Page ---
export async function buildInventoryManagement(req, res, next) {
  try {
    const inventory = await invModel.getInventory()
    const classifications = await invModel.getClassifications()

    res.render("inventory/index", {
      title: "Inventory Management",
      inventory,
      classifications,
      account: res.locals.account || null,
      messages: req.flash("message"),
    })
  } catch (err) {
    console.error("Error building Inventory Management:", err)
    next(err)
  }
}

// --- Add Classification ---
export async function buildAddClassification(req, res, next) {
  try {
    res.render("inventory/add-classification", {
      title: "Add Classification",
      account: res.locals.account || null,
      messages: req.flash("message"),
    })
  } catch (err) {
    next(err)
  }
}

export async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body
    if (!classification_name || classification_name.trim() === "") {
      req.flash("message", "Classification name is required.")
      return res.redirect("/cars/add-classification")
    }

    const result = await invModel.insertClassification(classification_name.trim())
    if (result) {
      req.flash("message", "Classification added successfully.")
      return res.redirect("/cars")
    }
    req.flash("message", "Failed to add classification.")
    res.redirect("/cars/add-classification")
  } catch (err) {
    console.error("Error adding classification:", err)
    next(err)
  }
}

// --- Add Inventory ---
export async function buildAddInventory(req, res, next) {
  try {
    const classificationList = await buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationList,
      account: res.locals.account || null,
      messages: req.flash("message"),
      formData: {},
    })
  } catch (err) {
    console.error("Error building Add Inventory page:", err)
    next(err)
  }
}

export async function addInventory(req, res, next) {
  try {
    const data = req.body
    if (!data.inv_make || !data.inv_model || !data.inv_price) {
      req.flash("message", "Please fill in all required fields.")
      return res.redirect("/cars/add-inventory")
    }

    const newVehicle = await invModel.insertInventory(data)
    if (newVehicle) {
      req.flash("message", "Vehicle added successfully.")
      return res.redirect("/cars")
    }
    req.flash("message", "Failed to add vehicle.")
    res.redirect("/cars/add-inventory")
  } catch (err) {
    console.error("Error adding inventory:", err)
    next(err)
  }
}

// --- Vehicle Detail View ---
export async function buildByVehicleId(req, res, next) {
  try {
    const invId = Number(req.params.invId)
    const vehicleData = await invModel.getVehicleById(invId)

    if (!vehicleData) {
      return res.status(404).render("errors/404", {
        title: "Not Found",
        message: "Vehicle not found",
        account: res.locals.account || null,
      })
    }

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicle: vehicleData,
      account: res.locals.account || null,
    })
  } catch (err) {
    console.error("Error building vehicle detail:", err)
    next(err)
  }
}

// ✅ --- Cars Page ---
export async function buildAllCars(req, res, next) {
  try {
    const nav = await getNav().catch(() => null)
    const vehicles = await invModel.getInventory() // использует твою текущую модель
    res.render("inventory/list", {
      title: "All Cars",
      nav,
      vehicles,
      account: res.locals.account || null,
    })
  } catch (error) {
    console.error("Error loading cars:", error)
    next(error)
  }
}
