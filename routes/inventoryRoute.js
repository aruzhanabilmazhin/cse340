import express from "express";
import * as invController from "../controllers/invController.js";

const router = express.Router();

// --- Management view ---
router.get("/", invController.buildManagementView);

// --- Vehicle detail view ---
router.get("/detail/:invId", invController.buildByVehicleId);

// --- Add Classification ---
router.get("/add-classification", invController.buildAddClassificationView);
router.post("/add-classification", invController.addClassification);

// --- Add Inventory ---
router.get("/add-inventory", invController.buildAddInventoryView);
router.post("/add-inventory", invController.addInventory);

// --- Footer test error ---
router.get("/trigger-error", (req, res, next) => {
  try {
    throw new Error("Intentional test error");
  } catch (err) {
    next(err);
  }
});

export default router;
