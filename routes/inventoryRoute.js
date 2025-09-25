// routes/inventoryRoute.js
import express from "express"
import { listVehicles, vehicleDetail } from "../controllers/invController.js"

const router = express.Router()

// /cars/
router.get("/", listVehicles)
// /cars/:inv_id
router.get("/:inv_id", vehicleDetail)

export default router
