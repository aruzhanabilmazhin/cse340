// ====== IMPORTS ======
import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import session from "express-session"
import flash from "connect-flash"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import expressLayouts from "express-ejs-layouts"

import inventoryRoute from "./routes/inventoryRoute.js"
import accountsRoute from "./routes/accountsRoute.js"
import { checkEmployeeOrAdmin } from "./utilities/index.js"

// ====== INITIAL SETUP ======
const app = express()
const port = process.env.PORT || 3000

// ====== PATHS ======
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ====== VIEW ENGINE ======
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// ====== LAYOUT CONFIG ======
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // default layout path

// ====== MIDDLEWARE ======
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ====== STATIC FILES ======
app.use(express.static(path.join(__dirname, "public"))) // ✅ serves /css, /images, etc.

// ====== SESSION & FLASH ======
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
)
app.use(flash())

// ====== JWT MIDDLEWARE ======
app.use((req, res, next) => {
  const token = req.cookies.jwt
  if (!token) {
    res.locals.account = null
    return next()
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret")
    res.locals.account = payload
  } catch (err) {
    console.error("⚠️ JWT Error:", err.message)
    res.clearCookie("jwt")
    res.locals.account = null
  }

  next()
})

// ====== ROUTES ======

// Home page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home | CSE Motors",
    messages: req.flash("info"),
    account: res.locals.account,
  })
})

// Inventory routes
app.use("/inv", checkEmployeeOrAdmin, inventoryRoute)

// Accounts routes
app.use("/accounts", accountsRoute)

// ====== 404 PAGE ======
app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found | CSE Motors",
    message: "Sorry, the page you requested could not be found.",
  })
})

// ====== 500 PAGE ======
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err)
  try {
    res.status(500).render("errors/500", {
      title: "Server Error | CSE Motors",
      message: err.message || "Something went wrong! Please try again later.",
    })
  } catch (e) {
    console.error("❌ Failed to render 500 page:", e)
    res.status(500).send("Internal Server Error")
  }
})

// ====== ERROR HANDLERS ======
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
})
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason)
})

// ====== START SERVER ======
app.listen(port, () => {
  console.log(`🚗 CSE Motors app running on port ${port}`)
})
