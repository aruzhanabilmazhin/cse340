// controllers/invController.js
import { getAllVehicles, getVehicleById } from "../models/mockInventory.js"
import { buildVehicleListHTML, buildVehicleDetailHTML } from "../utilities/index.js"

export async function listVehicles(req, res, next) {
  try {
    const vehicles = getAllVehicles()
    const vehicleListHTML = buildVehicleListHTML(vehicles)

    res.render("inventory/list", {
      title: "Available Cars",
      nav: "", // если у тебя есть генератор навигации — подключи его здесь
      content: `
        <main>
          <h1>Available Cars</h1>
          ${vehicleListHTML}
        </main>
      `
    })
  } catch (err) {
    next(err)
  }
}

export async function vehicleDetail(req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicle = getVehicleById(inv_id)

    if (!vehicle) {
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        nav: "",
        content: `
          <main>
            <h1>404 - Vehicle Not Found</h1>
            <p>We couldn't find the vehicle you requested.</p>
            <p><a href="/cars">Back to listings</a></p>
          </main>
        `
      })
    }

    const vehicleDetailHTML = buildVehicleDetailHTML(vehicle)

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav: "",
      vehicle: vehicleDetailHTML
    })
  } catch (err) {
    next(err)
  }
}
