// server.js
import express from "express"
import expressLayouts from "express-ejs-layouts"
import path from "path"
import { fileURLToPath } from "url"
import pool from "./database/index.js" // подключаем базу данных
import contactRoute from "./routes/contactRoute.js" // маршруты для контактной формы
import inventoryRoute from "./routes/inventoryRoute.js" // маршруты для машин
import errorController from "./controllers/errorController.js" // контроллер ошибок
import baseController from "./controllers/baseController.js" // контроллер для главной и about
import session from "express-session"
import flash from "connect-flash"

const app = express()

// ========== Setup paths ==========
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ========== View engine ==========
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layouts/layout") // layout.ejs внутри views/layouts/

// ========== Middleware ==========
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Сессии и Flash для сообщений
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  })
)
app.use(flash())

// Глобальные переменные для сообщений
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  next()
})

// Проверяем подключение к базе данных при запуске
pool
  .connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err))

// ========== Routes ==========

// --- Base routes ---
app.get("/", baseController.buildHome)
app.get("/about", baseController.buildAbout)

// --- Account routes ---
app.get("/account/login", (req, res) => {
  res.render("account/login", {
    title: "Login",
    account: null,
    messages: [],
  })
})

app.get("/account/register", (req, res) => {
  res.render("account/register", {
    title: "Register",
    account: null,
    messages: [],
  })
})

app.get("/account/manage", (req, res) => {
  res.render("account/manage", {
    title: "My Account",
    account: { firstname: "User" },
    messages: [],
  })
})

app.get("/account/logout", (req, res) => {
  res.redirect("/")
})

// --- Cars routes ---
app.use("/cars", inventoryRoute) // все маршруты /cars/*

/*
   ⚠️ Важно: теперь маршрут для списка всех машин находится по адресу
   http://localhost:3000/cars/cars
   Если хочешь, чтобы он открывался просто по /cars, поменяем в inventoryRoute.js
   router.get("/", invController.buildAllCars)
*/

// --- Contact routes ---
app.use("/contact", contactRoute)

// --- Error handling ---
app.use(errorController.notFound) // 404
app.use((err, req, res, next) => {
  console.error("⚠️ Server error:", err.stack)
  res.status(500)
  res.render("errors/500", {
    title: "500 - Server Error",
    message: err.message || "Something went wrong on the server.",
  })
})

// ========== Start server ==========
const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
  console.log(`🚗 Server running on http://localhost:${PORT}`)
)
