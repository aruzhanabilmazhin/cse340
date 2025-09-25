// server.js
import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const port = process.env.PORT || 3000

// ====== Fix __dirname in ES modules ======
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ====== Middleware ======
app.use(express.static(path.join(__dirname, "public"))) // css, js, images
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ====== View Engine ======
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// ====== Routes ======

// Home page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home"
  })
})

// Cars page
app.get("/cars", (req, res) => {
  // Временный список машин
  const vehicles = [
    { id: 1, make: "Toyota", model: "Corolla", year: 2020, price: 20000 },
    { id: 2, make: "Honda", model: "Civic", year: 2021, price: 22000 },
    { id: 3, make: "Ford", model: "Focus", year: 2019, price: 18000 }
  ]

  res.render("cars/list", {
    title: "Available Cars",
    vehicles
  })
})

// Test 500 error
app.get("/trigger-error", (req, res, next) => {
  try {
    throw new Error("Intentional Server Error")
  } catch (err) {
    next(err)
  }
})

// ====== Error Handlers ======

// 404
app.use((req, res, next) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "The page you are looking for does not exist."
  })
})

// 500
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "Oops! Something went wrong on our server."
  })
})

// ====== Start Server ======
app.listen(port, () => {
  console.log(`🚗 Server running at http://localhost:${port}`)
})
