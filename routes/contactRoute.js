import express from "express";
import pool from "../database/index.js";

const router = express.Router();

/* ============================
   ✅ CONTACT ROUTES
===============================*/

// Главная страница контактов (форма обратной связи)
router.get("/", (req, res) => {
  res.render("contact/index", {
    title: "Contact Us",
    account: null,
    messages: [],
  });
});

// Обработка формы с главной страницы
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO contact_messages (name, email, message, created_at) VALUES ($1, $2, $3, NOW())",
      [name, email, message]
    );
    res.redirect("/contact/list");
  } catch (err) {
    console.error("❌ Ошибка при добавлении:", err);
    res.status(500).send("Ошибка при добавлении сообщения.");
  }
});

// Страница добавления (альтернатива, если нужна отдельная)
router.get("/add", (req, res) => {
  res.render("contact/add", {
    title: "Add Message",
    account: null,
    messages: [],
  });
});

// Обработка формы добавления
router.post("/add", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO contact_messages (name, email, message, created_at) VALUES ($1, $2, $3, NOW())",
      [name, email, message]
    );
    res.redirect("/contact/list");
  } catch (err) {
    console.error("❌ Ошибка при добавлении:", err);
    res.status(500).send("Ошибка при добавлении сообщения.");
  }
});

// Список сообщений
router.get("/list", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.render("contact/list", {
      title: "Messages List",
      account: null,
      messages: result.rows,
    });
  } catch (err) {
    console.error("❌ Ошибка при получении:", err);
    res.status(500).send("Ошибка при загрузке сообщений.");
  }
});

export default router;
