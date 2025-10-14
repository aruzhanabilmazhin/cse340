import express from "express"
import * as invController from "../controllers/invController.js"
import { checkEmployeeOrAdmin } from "../utilities/index.js"

const router = express.Router()

// --- Inventory Management Page (доступна только сотрудникам/админам) ---
router.get("/", checkEmployeeOrAdmin, invController.buildInventoryManagement)

// --- Add Classification (доступна только сотрудникам/админам) ---
router.get("/add-classification", checkEmployeeOrAdmin, invController.buildAddClassification)
router.post("/add-classification", checkEmployeeOrAdmin, invController.addClassification)

// --- Add Inventory (доступна только сотрудникам/админам) ---
router.get("/add-inventory", checkEmployeeOrAdmin, invController.buildAddInventory)
router.post("/add-inventory", checkEmployeeOrAdmin, invController.addInventory)

// --- Vehicle Detail View (доступна всем) ---
router.get("/detail/:invId", invController.buildByVehicleId)

// ✅ Публичная страница — All Cars (без авторизации)
router.get("/cars", invController.buildAllCars)

export default router
