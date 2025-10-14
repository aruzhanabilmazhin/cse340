// utilities/index.js
import jwt from "jsonwebtoken"
import * as invModel from "../models/inventory-model.js"
import pool from "../database/index.js"

/* ===============================
   🌐 NAVIGATION BUILDER
================================= */
export async function getNav() {
  try {
    const [rows] = await pool.query(
      "SELECT classification_id, classification_name FROM classification ORDER BY classification_name"
    )

    let nav = '<ul class="nav-list">'
    nav += '<li><a href="/" title="Home page">Home</a></li>'
    nav += '<li><a href="/inv/cars" title="See all cars">Cars</a></li>'
    rows.forEach((row) => {
      nav += `<li><a href="/inv/type/${row.classification_id}" title="View ${row.classification_name}">${row.classification_name}</a></li>`
    })
    nav += '<li><a href="/about" title="About page">About</a></li>'
    nav += "</ul>"
    return nav
  } catch (error) {
    console.error("❌ Error building navigation:", error)
    return '<ul class="nav-list"><li><a href="/">Home</a></li></ul>'
  }
}

/* ===============================
   🚗 VEHICLE DETAIL VIEW
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
        <p><strong>Description:</strong> ${vehicle.inv_description || "No description available"}</p>
      </div>
    </section>
  `
}

/* ===============================
   📋 CLASSIFICATION LIST BUILDER
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
