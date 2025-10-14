// routes/inventoryRoute.js

import express from "express"
import * as invController from "../controllers/inventoryController.js" // ✅ проверь, чтобы файл назывался именно inventoryController.js
import { checkEmployeeOrAdmin } from "../utilities/index.js"

const router = express.Router()

// --- Inventory Management Page (страница управления инвентарем) ---
router.get("/", checkEmployeeOrAdmin, invController.buildInventoryManagement)

// --- Add Classification (добавить категорию) ---
router.get("/add-classification", checkEmployeeOrAdmin, invController.buildAddClassification)
router.post("/add-classification", checkEmployeeOrAdmin, invController.addClassification)

// --- Add Inventory (добавить автомобиль) ---
router.get("/add-inventory", checkEmployeeOrAdmin, invController.buildAddInventory)
router.post("/add-inventory", checkEmployeeOrAdmin, invController.addInventory)

// --- Vehicle Detail View (страница конкретного автомобиля) ---
router.get("/detail/:invId", invController.buildByVehicleId)

// ✅ Страница со всеми машинами (Cars List)
router.get("/cars", invController.buildAllCars)

export default router
