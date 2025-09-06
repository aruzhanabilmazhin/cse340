import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.static("public"));


app.set("view engine", "ejs");
app.set("views", "./views");

// Главная страница
app.get("/", (req, res) => {
  res.render("index", { title: "Главная страница", message: "CSE MOTORS" });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
