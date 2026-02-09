// models/inventory-model.js
import pool from "../database/index.js";

/**
 * Get a single inventory item by its ID.
 * Uses a parameterized query ($1)
 */
async function getInventoryById(inv_id) {
  const sql = `SELECT * FROM public.inventory WHERE inv_id = $1`;
  const data = await pool.query(sql, [inv_id]);
  return data.rows[0];
}

/**
 * Get all inventory items for a given classification_id.
 * Uses a parameterized query ($1)
 */
async function getInventoryByClassificationId(classification_id) {
  const sql = `
    SELECT inv_id,
           inv_make,
           inv_model,
           inv_year,
           inv_price,
           inv_miles,
           inv_image
    FROM public.inventory
    WHERE classification_id = $1
    ORDER BY inv_make, inv_model;
  `;
  const data = await pool.query(sql, [classification_id]);
  return data.rows;
}

const inventoryModel = {
  getInventoryById,
  getInventoryByClassificationId,
};

export default inventoryModel;
