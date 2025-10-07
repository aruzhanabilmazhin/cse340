import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import flash from "connect-flash";
import inventoryRoute from "./routes/inventoryRoute.js";

const app = express();
const port = process.env.PORT || 3000;

// ====== Paths ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== View Engine ======
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ====== Middleware ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ====== Session & Flash ======
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // true — только если HTTPS
  })
);
app.use(flash());

// ====== ROUTES ======

// Главная страница
app.get("/", async (req, res, next) => {
  try {
    res.render("index", { title: "Home | CSE Motors" });
  } catch (err) {
    console.error("❌ Error rendering index:", err);
    next(err); // передаём в 500 middleware
  }
});

// Inventory routes
app.use("/inv", inventoryRoute);

// ====== 404 Not Found ======
app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "Sorry, the page you requested could not be found.",
  });
});

// ====== 500 Server Error ======
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  console.error(err.stack); // полный стек ошибки

  try {
    // проверяем наличие ejs файла
    res.status(500).render("errors/500", {
      title: "Server Error",
      message: err.message || "Something went wrong! Please try again later.",
    });
  } catch (e) {
    console.error("❌ Failed to render 500 page:", e);
    res.status(500).send("Internal Server Error");
  }
});

// ====== Start Server ======
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
