import express from "express";
import * as invController from "../controllers/invController.js";

const router = express.Router();

// Inventory management page
router.get("/", invController.buildInventoryManagement);

// Add Classification
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.addClassification);

// Add Inventory
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.addInventory);

export default router;
