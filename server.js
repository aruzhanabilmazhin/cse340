// server.js
const express = require("express")
const path = require("path")
const app = express()
const port = process.env.PORT || 3000

// ====== Middleware ======
app.use(express.static(path.join(__dirname, "public"))) // папка для css, js, images
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Устанавливаем EJS как шаблонизатор
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// ====== Routes ======
// Главная страница
app.get("/", (req, res) => {
  res.render("index", { 
    title: "Home | CSE Motors" 
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
  console.log(`Server running at http://localhost:${port}`)
})
