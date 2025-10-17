// server.js
import express from "express"
import expressLayouts from "express-ejs-layouts"
import path from "path"
import { fileURLToPath } from "url"
import pool from "./database/index.js"
import contactRoute from "./routes/contactRoute.js"
import inventoryRoute from "./routes/inventoryRoute.js"
import errorController from "./controllers/errorController.js"
import baseController from "./controllers/baseController.js"

import session from "express-session"
import flash from "connect-flash"
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt" // ✅ подключаем bcrypt здесь

const app = express()

// ========== Setup paths ==========
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ========== View engine ==========
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layouts/layout")

// ========== Middleware ==========
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// ========== Sessions & Flash ==========
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  })
)
app.use(flash())

// Make flash + account available globally
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.info = req.flash("info")
  res.locals.account = res.locals.account || null
  next()
})

// ========== DB connection ==========
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
  res.render("account/login", { title: "Login", account: null, messages: [], message: null })
})

app.get("/account/register", (req, res) => {
  res.render("account/register", { title: "Register", account: null, messages: [], message: null })
})

// --- Account registration POST route ---
app.post("/account/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body

  // Проверка на пустые поля
  if (!firstname || !lastname || !email || !password) {
    req.flash("error_msg", "Please fill in all fields")
    return res.redirect("/account/register")
  }

  try {
    // Проверяем, есть ли уже пользователь с таким email
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    if (existingUser.rows.length > 0) {
      req.flash("error_msg", "Email already registered")
      return res.redirect("/account/register")
    }

    // Хешируем пароль перед сохранением
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Вставляем нового пользователя в базу
    await pool.query(
      "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)",
      [firstname, lastname, email, hashedPassword]
    )

    req.flash("success_msg", "Account created successfully! Please log in.")
    res.redirect("/account/login")
  } catch (err) {
    console.error("❌ Registration error:", err)
    req.flash("error_msg", "Server error. Please try again later.")
    res.redirect("/account/register")
  }
})

app.get("/account/manage", (req, res) => {
  res.render("account/manage", {
    title: "My Account",
    account: { firstname: "User" },
    messages: [],
    message: null,
  })
})

app.get("/account/logout", (req, res) => {
  res.clearCookie("jwt")
  req.session.destroy(() => res.redirect("/"))
})

// --- Inventory routes ---
app.use("/inv", inventoryRoute)

// --- Contact routes ---
app.use("/contact", contactRoute)

// ========== Error handling ==========

// 404 handler
app.use(errorController.notFound)

// 500 handler (must have 4 args)
app.use((err, req, res, next) => {
  console.error("⚠️ Server error:", err.stack || err)
  return errorController.serverError(err, req, res, next)
})

// ========== Start server ==========
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚗 Server running on http://localhost:${PORT}`))
