import pool from "../database/index.js";

export async function addUser(firstname, lastname, email, password) {
  try {
    const sql = `
      INSERT INTO users (firstname, lastname, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id;
    `;
    const result = await pool.query(sql, [firstname, lastname, email, password]);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

export async function getAllUsers() {
  const result = await pool.query("SELECT * FROM users ORDER BY user_id DESC");
  return result.rows;
}
