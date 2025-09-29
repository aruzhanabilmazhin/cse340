import express from "express";
import * as invController from "../controllers/invController.js";

const router = express.Router();

// Vehicle detail view
router.get("/detail/:invId", invController.buildByVehicleId);

// Footer error link
router.get("/trigger-error", (req, res, next) => {
  try {
    throw new Error("Intentional test error");
  } catch (err) {
    next(err);
  }
});

export default router;
