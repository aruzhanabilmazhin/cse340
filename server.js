import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import flash from "connect-flash";
import inventoryRoute from "./routes/inventoryRoute.js";

const app = express();
const port = process.env.PORT || 3000;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Session & Flash
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(flash());

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/inv", inventoryRoute);

// 404 Not Found
app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "Sorry, this page does not exist.",
  });
});

// 500 Server Error
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "Something went wrong!",
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
