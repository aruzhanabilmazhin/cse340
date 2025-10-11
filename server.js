import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home", account: null });
});

app.get("/accounts/login", (req, res) => {
  res.render("accounts/login", { title: "Login", layout: "./layouts/auth" });
});

app.get("/accounts/register", (req, res) => {
  res.render("accounts/register", { title: "Register", layout: "./layouts/auth" });
});

app.post("/accounts/login", (req, res) => {
  // временно просто редиректим
  res.redirect("/");
});

app.post("/accounts/register", (req, res) => {
  // временно просто редиректим
  res.redirect("/accounts/login");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚗 Server running on port ${PORT}`));
