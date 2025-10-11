import jwt from "jsonwebtoken"
import * as invModel from "../models/inventory-model.js"

/* ===============================
   VEHICLE DETAIL VIEW BUILDER
================================= */
export function buildVehicleDetailView(vehicle) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.inv_price || 0)

  const mileage = vehicle.inv_miles
    ? vehicle.inv_miles.toLocaleString("en-US")
    : "0"

  return `
    <section class="vehicle-detail">
      <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="vehicle-info">
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${mileage} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description || "No description"}</p>
      </div>
    </section>
  `
}

/* ===============================
   CLASSIFICATION LIST BUILDER
================================= */
export async function buildClassificationList(selectedId = null) {
  const data = await invModel.getClassifications()
  let list = '<select name="classification_id" id="classificationList" required>'
  list += '<option value="">Choose a Classification</option>'
  data.forEach((c) => {
    list += `<option value="${c.classification_id}"${
      selectedId == c.classification_id ? " selected" : ""
    }>${c.classification_name}</option>`
  })
  list += "</select>"
  return list
}

/* ===============================
   🔒 AUTH MIDDLEWARE
================================= */

// ✅ Проверяет, вошёл ли пользователь
export function checkLogin(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    req.flash("info", "You must be logged in to access this page.")
    return res.redirect("/accounts/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    res.locals.account = decoded
    next()
  } catch (err) {
    console.error("Invalid JWT:", err)
    req.flash("info", "Session expired, please log in again.")
    res.clearCookie("jwt")
    return res.redirect("/accounts/login")
  }
}

// ✅ Проверяет, что пользователь — Employee или Admin
export function checkEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    req.flash("info", "You must be logged in to access this page.")
    return res.redirect("/accounts/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      res.locals.account = decoded
      return next()
    } else {
      req.flash("info", "Access denied. Employees or Admins only.")
      return res.redirect("/accounts/login")
    }
  } catch (err) {
    console.error("JWT Error:", err)
    req.flash("info", "Invalid session, please log in again.")
    res.clearCookie("jwt")
    return res.redirect("/accounts/login")
  }
}
