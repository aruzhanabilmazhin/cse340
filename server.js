import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ========== Setup paths ==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== View engine ==========
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout"); // глобальный layout.ejs

// ========== Middleware ==========
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  // Здесь будет логика выхода
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

// -------- 404 fallback --------
app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    account: null,
    messages: [],
  });
});

// ========== Start server ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚗 Server running on http://localhost:${PORT}`));
