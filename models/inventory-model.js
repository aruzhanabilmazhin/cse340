import pool from "../database/Index.js";

// --- Получение конкретного автомобиля ---
export async function getVehicleById(invId) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [invId]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

// --- Добавление классификации ---
export async function insertClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    const result = await pool.query(sql, [classification_name]);
    return result;
  } catch (err) {
    throw err;
  }
}

// --- Добавление инвентаря ---
export async function insertInventory(data) {
  try {
    const sql = `
      INSERT INTO inventory
        (inv_make, inv_model, inv_year, inv_price, classification_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_price,
      data.classification_id
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

// --- Получение всех классификаций ---
export async function getClassifications() {
  try {
    const sql = "SELECT classification_id, classification_name FROM classification ORDER BY classification_name";
    const result = await pool.query(sql);
    return result.rows;
  } catch (err) {
    throw err;
  }
}
