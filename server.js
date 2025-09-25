// server.js
import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const port = process.env.PORT || 3000

// ====== Fix for __dirname in ES modules ======
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ====== Middleware ======
app.use(express.static(path.join(__dirname, "public"))) // для css, js, images
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Устанавливаем EJS как шаблонизатор
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// ====== Данные (вместо базы) ======
const vehicles = [
  { id: 1, make: "Toyota", model: "Corolla", year: 2020, price: 20000 },
  { id: 2, make: "Honda", model: "Civic", year: 2021, price: 22000 },
  { id: 3, make: "Ford", model: "Focus", year: 2019, price: 18000 }
]

// ====== Routes ======

// Главная страница
app.get("/", (req, res) => {
  res.render("index", { 
    title: "Home | CSE Motors" 
  })
})

// Каталог автомобилей
app.get("/cars", (req, res) => {
  res.render("inventory/list", {
    title: "Available Cars",
    vehicles
  })
})

// Детали автомобиля
app.get("/cars/:id", (req, res) => {
  const vehicle = vehicles.find(v => v.id === parseInt(req.params.id))

  if (!vehicle) {
    return res.status(404).render("errors/404", {
      title: "Car Not Found",
      message: "The vehicle you are looking for does not exist."
    })
  }

  res.render("inventory/detail", {
    title: `${vehicle.make} ${vehicle.model}`,
    vehicle
  })
})

// Тестовый маршрут для вызова 500 ошибки
app.get("/trigger-error", (req, res, next) => {
  try {
    throw new Error("Intentional Server Error")
  } catch (err) {
    next(err) // передаем в обработчик ошибок
  }
})

// ====== Error Handlers ======

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "The page you are looking for does not exist."
  })
})

// 500 Internal Server Error
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "Oops! Something went wrong on our server."
  })
})

// ====== Server Start ======
app.listen(port, () => {
  console.log(`🚗 Server running at http://localhost:${port}`)
})
