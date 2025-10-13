import express from "express";
import pool from "../database/index.js";

const router = express.Router();

// -------- Account routes --------

// Login page
router.get("/login", (req, res) => {
  res.render("account/login", {
    title: "Login",
    account: null,
    messages: [],
  });
});

// Register page
router.get("/register", (req, res) => {
  res.render("account/register", {
    title: "Register",
    account: null,
    messages: [],
  });
});

// Manage account page
router.get("/manage", (req, res) => {
  res.render("account/manage", {
    title: "My Account",
    account: { firstname: "User" },
    messages: [],
  });
});

// Logout
router.get("/logout", (req, res) => {
  res.redirect("/");
});

// -------- Contact form enhancement --------

// ✅ Страница добавления сообщения
router.get("/contact/add", (req, res) => {
  res.render("add", {
    title: "Add Message",
    account: null,
    messages: [],
  });
});

// ✅ Обработка формы добавления
router.post("/contact/add", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await pool.query(
      "INSERT INTO contact_messages (name, email, message, created_at) VALUES ($1, $2, $3, NOW())",
      [name, email, message]
    );
    res.redirect("/account/contact/list");
  } catch (err) {
    console.error("❌ Ошибка при добавлении:", err);
    res.status(500).send("Ошибка при добавлении сообщения.");
  }
});

// ✅ Страница со списком сообщений
router.get("/contact/list", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.render("list", {
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
