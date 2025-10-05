import express from "express";
import * as invController from "../controllers/invController.js";
import { checkClassification, checkInventory } from "../middleware/validation.js"; // добавляем middleware для валидации

const router = express.Router();

// --- Vehicle detail view ---
router.get("/detail/:invId", invController.buildByVehicleId);

// --- Footer error link ---
router.get("/trigger-error", (req, res, next) => {
  try {
    throw new Error("Intentional test error");
  } catch (err) {
    next(err);
  }
});

// --- Task 1: Management View ---
router.get("/", invController.buildManagementView);

// --- Task 2: Add Classification ---
router.get("/classification/add", invController.buildAddClassificationView);
router.post("/classification/add", checkClassification, invController.addClassification);

// --- Task 3: Add Inventory ---
router.get("/add", invController.buildAddInventoryView);
router.post("/add", checkInventory, invController.addInventory);

export default router;
