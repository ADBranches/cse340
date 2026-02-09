import pool from "../database/index.js";

/**
 * Getting a single inventory item by its ID.
 * Uses a parameterized query ($1) 
 */
export async function getInventoryById(inv_id) {
  const sql = `SELECT * FROM public.inventory WHERE inv_id = $1`;
  const data = await pool.query(sql, [inv_id]);
  return data.rows[0];
}
