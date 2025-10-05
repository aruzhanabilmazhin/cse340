// database/index.js
import dotenv from "dotenv";
import pg from "pg";

dotenv.config(); // Загружает переменные окружения из .env

// Создаём пул подключений к базе данных
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // URL базы из .env
  ssl: { rejectUnauthorized: false }, // важно для Render
});

export default pool;
