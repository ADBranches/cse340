import pool from "../utilities/db.js";

/*********************************
 * Insert new classification
 *********************************/
export async function addClassification(classification_name) {
  const sql = `
    INSERT INTO classification (classification_name)
    VALUES ($1)
    RETURNING *
  `;
  const result = await pool.query(sql, [classification_name]);
  return result.rowCount;
}

/*********************************
 * Fetch classifications
 *********************************/
export async function getClassifications() {
  const result = await pool.query(
    "SELECT * FROM classification ORDER BY classification_name"
  );
  return result.rows;
}

/*********************************
 * Add new inventory item
 *********************************/
export async function addInventory(data) {
  const sql = `
    INSERT INTO inventory (
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `;

  const params = [
    data.inv_make,
    data.inv_model,
    data.inv_year,
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    data.inv_price,
    data.inv_miles,
    data.inv_color,
    parseInt(data.classification_id)
  ];

  const result = await pool.query(sql, params);
  return result.rows[0];
}
