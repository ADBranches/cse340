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

async function getClassifications() {
  const sql = `
    SELECT classification_id, classification_name
    FROM public.classification
    ORDER BY classification_name;
  `;
  const data = await pool.query(sql);
  return data.rows;
}

async function addInventory({
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id,
}) {
  const sql = `
    INSERT INTO public.inventory (
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING inv_id;
  `;

  const values = [
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  ];

  const result = await pool.query(sql, values);
  return result.rows[0];
}

async function addClassification(classification_name) {
  const sql = `
    INSERT INTO public.classification (classification_name)
    VALUES ($1)
    RETURNING classification_id, classification_name;
  `;
  const result = await pool.query(sql, [classification_name]);
  return result.rows[0];
}

const inventoryModel = {
  getInventoryById,
  addClassification,
  getInventoryByClassificationId,
  getClassifications,
  addInventory,   
};

export default inventoryModel;
