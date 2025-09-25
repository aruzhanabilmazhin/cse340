import { getAllVehicles, getVehicleById } from "../models/mockInventory.js"
import { buildVehicleListHTML, buildVehicleDetailHTML } from "../utilities/index.js"

// показать список всех машин
export async function buildVehicleList(req, res, next) {
  try {
    const vehicles = getAllVehicles()
    const vehicleList = buildVehicleListHTML(vehicles)

    res.render("inventory/list", {
      title: "Available Cars",
      vehicleList
    })
  } catch (err) {
    next(err)
  }
}

// показать детали конкретной машины
export async function buildVehicleDetail(req, res, next) {
  try {
    const id = req.params.id
    const vehicle = getVehicleById(id)

    if (!vehicle) {
      return res.status(404).render("errors/404", {
        title: "Not Found",
        message: "Vehicle not found."
      })
    }

    const vehicleDetail = buildVehicleDetailHTML(vehicle)

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicleDetail
    })
  } catch (err) {
    next(err)
  }
}
