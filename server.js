import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import session from "express-session"
import flash from "connect-flash"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"

import inventoryRoute from "./routes/inventoryRoute.js"
import accountsRoute from "./routes/accountsRoute.js"
import { checkEmployeeOrAdmin, checkLogin } from "./utilities/index.js"

const app = express()
const port = process.env.PORT || 3000

// ====== Paths ======
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ====== View Engine ======
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// ====== Middleware ======
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())

// ====== Session & Flash ======
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
)
app.use(flash())

// ====== JWT Middleware ======
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
    console.error("⚠️ Ошибка JWT:", err.message)
    res.clearCookie("jwt")
    res.locals.account = null
  }

  next()
})

// ====== ROUTES ======

// Главная страница
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

// ====== 404 ======
app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "Sorry, the page you requested could not be found.",
  })
})

// ====== 500 ======
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err)
  try {
    res.status(500).render("errors/500", {
      title: "Server Error",
      message: err.message || "Something went wrong! Please try again later.",
    })
  } catch (e) {
    console.error("❌ Failed to render 500 page:", e)
    res.status(500).send("Internal Server Error")
  }
})

// ====== Uncaught Errors ======
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
})
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason)
})

// ====== Start Server ======
app.listen(port, () => {
  console.log(`🚗 CSE Motors app running on port ${port}`)
})
