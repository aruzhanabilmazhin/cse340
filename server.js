// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

// ====== Fix __dirname in ES modules ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Middleware ======
app.use(express.static(path.join(__dirname, "public"))); // css, js, images
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Устанавливаем EJS как шаблонизатор
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ====== Data (mock vehicles) ======
const vehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2020,
    price: 25000,
    image: "car1.jpg"
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    year: 2019,
    price: 22000,
    image: "car2.jpg"
  },
  {
    id: 3,
    make: "Ford",
    model: "Focus",
    year: 2021,
    price: 24000,
    image: "car3.jpg"
  }
];

// ====== Routes ======

// Главная страница
app.get("/", (req, res) => {
  res.render("index", { 
    title: "Home | CSE Motors"
  });
});

// Список машин
app.get("/cars", (req, res) => {
  res.render("inventory/list", {
    title: "Cars",
    vehicles
  });
});

// Детали конкретной машины
app.get("/cars/:id", (req, res) => {
  const carId = parseInt(req.params.id);
  const vehicle = vehicles.find(v => v.id === carId);

  if (!vehicle) {
    return res.status(404).render("errors/404", {
      title: "Car Not Found",
      message: "The car you are looking for does not exist."
    });
  }

  // Форматируем цену на сервере
  const formattedPrice = vehicle.price.toLocaleString("en-US", { style: "currency", currency: "USD" });

  res.render("inventory/detail", {
    title: `${vehicle.make} ${vehicle.model}`,
    vehicle,
    formattedPrice
  });
});

// Тестовый маршрут для вызова 500 ошибки
app.get("/trigger-error", (req, res, next) => {
  try {
    throw new Error("Intentional Server Error");
  } catch (err) {
    next(err);
  }
});

// ====== Error Handlers ======

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "The page you are looking for does not exist."
  });
});

// 500 Internal Server Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "Oops! Something went wrong on our server."
  });
});

// ====== Server Start ======
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
