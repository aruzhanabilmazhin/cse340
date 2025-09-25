// server.js
import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const port = process.env.PORT || 3000

// ====== Настройки путей ======
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ====== Middleware ======
app.use(express.static(path.join(__dirname, "public"))) // статические файлы: css, js, images
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Устанавливаем EJS как шаблонизатор
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// ====== Routes ======
// Главная страница
app.get("/", (req, res) => {
  res.render("index", { 
    title: "Home",
    body: `
      <section>
        <h2>Welcome to CSE Motors</h2>
        <p>Find your dream car today!</p>
      </section>
    `
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
    title: "Page Not Found"
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
  console.log(`🚗 CSE Motors running at http://localhost:${port}`)
})
