// server.js (ESM)
import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import inventoryRoute from "./routes/inventoryRoute.js" // <-- добавлено

const app = express()
const port = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Views
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    body: `
      <section>
        <h2>Welcome to CSE Motors</h2>
        <p>Find your dream car today!</p>
        <p><a href="/cars">Browse Cars</a></p>
      </section>
    `
  })
})

// подключаем роутер: /cars и /cars/:inv_id
app.use("/cars", inventoryRoute)

// test 500
app.get("/trigger-error", (req, res, next) => {
  next(new Error("Intentional Server Error"))
})

// 404 handler (routes not matched)
app.use((req, res, next) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    body: `<section><h1>404 - Page Not Found</h1><p>The page you requested does not exist.</p><p><a href="/">Return to Home</a></p></section>`
  })
})

// 500 handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "Oops! Something went wrong on our server.",
    body: `<section><h1>500 - Server Error</h1><p>Oops! Something went wrong on our server.</p><p><a href='/'>Return to Home</a></p></section>`
  })
})

app.listen(port, () => {
  console.log(`🚗 Server running at http://localhost:${port}`)
})
