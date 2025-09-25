const invModel = require("../models/inventory-model")
const utilities = require("../utilities")


async function buildByInvId(req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicleData = await invModel.getVehicleById(inv_id)

    if (!vehicleData) {
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        nav: await utilities.getNav(),
        message: "Sorry, we couldn't find that vehicle."
      })
    }

    const vehicleHTML = utilities.buildVehicleDetailHTML(vehicleData)

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav: await utilities.getNav(),
      vehicle: vehicleHTML
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildByInvId
  
}
