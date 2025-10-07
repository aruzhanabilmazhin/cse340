import express from "express";
import * as invController from "../controllers/invController.js";

const router = express.Router();

router.get("/", invController.buildInventoryManagement);

router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.addClassification);

router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.addInventory);

router.get("/detail/:invId", invController.buildByVehicleId);

export default router;
