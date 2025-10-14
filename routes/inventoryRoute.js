import express from "express"
import * as invController from "../controllers/invController.js"
import { checkEmployeeOrAdmin } from "../utilities/index.js"

const router = express.Router()

// --- Inventory Management Page ---
router.get("/", checkEmployeeOrAdmin, invController.buildInventoryManagement)

// --- Add Classification ---
router.get("/add-classification", checkEmployeeOrAdmin, invController.buildAddClassification)
router.post("/add-classification", checkEmployeeOrAdmin, invController.addClassification)

// --- Add Inventory ---
router.get("/add-inventory", checkEmployeeOrAdmin, invController.buildAddInventory)
router.post("/add-inventory", checkEmployeeOrAdmin, invController.addInventory)

// --- Vehicle Detail ---
router.get("/detail/:invId", invController.buildByVehicleId)

// --- All Cars page ---
// Чтобы страница открывалась по /cars
router.get("/", invController.buildAllCars)

export default router
