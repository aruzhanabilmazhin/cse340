import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./database/index.js"; // ✅ подключаем базу данных
import contactRoute from "./routes/contactRoute.js"; // ✅ маршруты для контактной формы
import errorController from "./controllers/errorController.js"; // ✅ контроллер ошибок

const app = express();

// ========== Setup paths ==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== View engine ==========
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/layout"); // ищет views/layouts/layout.ejs

// ========== Middleware ==========
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Подключаем клиентскую валидацию форм
// (файл public/js/forms.js будет автоматически подгружен через <script> в layout.ejs)

// ✅ Проверяем подключение к базе при запуске
pool.connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err));

// ========== Routes ==========

// Home page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    account: null,
    messages: [],
  });
});

// -------- Account routes --------

// Login page
app.get("/account/login", (req, res) => {
  res.render("account/login", {
    title: "Login",
    account: null,
    messages: [],
  });
});

// Register page
app.get("/account/register", (req, res) => {
  res.render("account/register", {
    title: "Register",
    account: null,
    messages: [],
  });
});

// Manage account page (example)
app.get("/account/manage", (req, res) => {
  res.render("account/manage", {
    title: "My Account",
    account: { firstname: "User" }, // пример, позже подставим реального пользователя
    messages: [],
  });
});

// Logout (placeholder)
app.get("/account/logout", (req, res) => {
  res.redirect("/");
});

// -------- Cars routes --------

// Inventory page
app.get("/cars", (req, res) => {
  res.render("inventory", {
    title: "Inventory",
    account: null,
    messages: [],
  });
});

// Car detail page example
app.get("/cars/detail/:id", (req, res) => {
  const carId = req.params.id;
  res.render("car-detail", {
    title: `Car ${carId}`,
    account: null,
    messages: [],
    carId,
  });
});

// -------- Contact routes --------
app.use("/contact", contactRoute);

// -------- Error routes (404 и 500) --------
app.use(errorController.notFound); // если ни один маршрут не совпал
app.use(errorController.serverError); // если произошла серверная ошибка

// ========== Start server ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚗 Server running on http://localhost:${PORT}`)
);
