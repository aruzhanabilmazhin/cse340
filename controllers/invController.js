import * as invModel from "../models/inventory-model.js";
import { buildVehicleDetailView } from "../utilities/index.js";

export async function buildByVehicleId(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const vehicleData = await invModel.getVehicleById(invId);

    if (!vehicleData) {
      return res.status(404).render("404", { message: "Vehicle not found" });
    }

    const vehicleHTML = buildVehicleDetailView(vehicleData);

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      content: vehicleHTML,
    });
  } catch (err) {
    next(err);
  }
}
