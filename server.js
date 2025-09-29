import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import inventoryRoute from "./routes/inventoryRoute.js";

const app = express();
const port = process.env.PORT || 3000;

// ====== Fix __dirname in ES modules ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== View Engine ======
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ====== Middleware ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== Static Files ======
app.use(express.static(path.join(__dirname, "public")));

// ====== Routes ======
app.get("/", (req, res) => {
  res.render("index", { title: "Home", content: "Welcome to Vehicle Inventory!" });
});

// Inventory routes
app.use("/inv", inventoryRoute);

// ====== Error Routes ======
// 404 not found
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found", message: "Sorry, this page does not exist." });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Server Error", message: "Something went wrong!" });
});

// ====== Start Server ======
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
