import express from "express";
import * as invController from "../controllers/invController.js";

const router = express.Router();

// --- Inventory management page ---
router.get("/", invController.buildManagementView);

// --- Add classification ---
router.get("/add-classification", invController.buildAddClassificationView);
router.post("/add-classification", invController.insertClassification);

// --- Add inventory item ---
router.get("/add-inventory", invController.buildAddInventoryView);
router.post("/add-inventory", invController.insertInventory);

// --- Vehicle detail view ---
router.get("/detail/:invId", invController.buildByVehicleId);

export default router;
