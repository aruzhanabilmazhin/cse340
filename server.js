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
app.set("layout", "./layouts/layout"); // <-- твой layout.ejs

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

// Login page
app.get("/accounts/login", (req, res) => {
  res.render("accounts/login", {
    title: "Login",
    layout: "./layouts/layout", // можно использовать тот же layout
    account: null,
    messages: [],
  });
});

// Register page
app.get("/accounts/register", (req, res) => {
  res.render("accounts/register", {
    title: "Register",
    layout: "./layouts/layout",
    account: null,
    messages: [],
  });
});

// Inventory page
app.get("/inv", (req, res) => {
  res.render("inventory", {
    title: "Inventory",
    account: null,
    messages: [],
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    layout: "./layouts/layout",
    account: null,
    messages: [],
  });
});

// ========== Start server ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚗 Server running on port ${PORT}`));
