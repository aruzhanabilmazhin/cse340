import express from "express"
import { buildVehicleList, buildVehicleDetail } from "../controllers/invController.js"

const router = express.Router()

// список машин
router.get("/", buildVehicleList)

// детали машины
router.get("/:id", buildVehicleDetail)

export default router
