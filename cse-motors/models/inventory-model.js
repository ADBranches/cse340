// models/inventory-model.js
import pool from "../utilities/db.js";

/**
 * Insert new classification into DB
 */
export async function addClassification(classification_name) {
  const sql = `
    INSERT INTO classification (classification_name)
    VALUES ($1)
    RETURNING *
  `;
  const result = await pool.query(sql, [classification_name]);
  return result.rowCount; // 1 = success
}
