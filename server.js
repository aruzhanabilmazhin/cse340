// server.js
import express from "express"
import expressLayouts from "express-ejs-layouts"
import path from "path"
import { fileURLToPath } from "url"
import pool from "./database/index.js" // ✅ подключаем базу данных
import contactRoute from "./routes/contactRoute.js" // ✅ маршруты для контактной формы
import inventoryRoute from "./routes/inventoryRoute.js" // ✅ маршруты для машин
import errorController from "./controllers/errorController.js" // ✅ контроллер ошибок
import baseController from "./controllers/baseController.js" // ✅ контроллер для главной и about

// auth / session helpers
import session from "express-session"
import flash from "connect-flash"
import cookieParser from "cookie-parser"

const app = express()

// ========== Setup paths ==========
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ========== View engine ==========
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layouts/layout") // ищет views/layouts/layout.ejs

// ========== Middleware ==========
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser()) // нужно для чтения JWT/cookies

// ========== Sessions & Flash ==========
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  })
)
app.use(flash())

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.info = req.flash("info")
  res.locals.account = res.locals.account || null
  next()
})

// ========== DB connection check ==========
pool
  .connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err))

// ========== Routes ==========

// --- Base routes (Home & About) ---
app.get("/", baseController.buildHome)
app.get("/about", baseController.buildAbout)

// --- Account routes ---
app.get("/account/login", (req, res) => {
  res.render("account/login", { title: "Login", account: null, messages: [] })
})

app.get("/account/register", (req, res) => {
  res.render("account/register", { title: "Register", account: null, messages: [] })
})

app.get("/account/manage", (req, res) => {
  res.render("account/manage", {
    title: "My Account",
    account: { firstname: "User" }, // пример
    messages: [],
  })
})

app.get("/account/logout", (req, res) => {
  res.clearCookie("jwt")
  req.session.destroy(() => {
    res.redirect("/")
  })
})

// --- Inventory / Cars routes ---
app.use("/cars", inventoryRoute) // ✅ все маршруты внутри /cars (включая /cars/cars и /cars/detail/:id)

// --- Contact routes ---
app.use("/contact", contactRoute)

// ========== Error handling ==========

// 404 handler
app.use(errorController.notFound)

// 500 handler (Express error middleware — обязательно 4 аргумента)
app.use((err, req, res, next) => {
  console.error("⚠️ Server error:", err.stack || err)
  if (errorController && typeof errorController.serverError === "function") {
    return errorController.serverError(err, req, res, next)
  }
  res.status(500).render("errors/500", {
    title: "500 - Server Error",
    message: err.message || "Something went wrong on the server.",
  })
})

// ========== Start server ==========
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚗 Server running on http://localhost:${PORT}`))
