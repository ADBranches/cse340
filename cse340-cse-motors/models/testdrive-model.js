// models/testdrive-model.js
import pool from "../database/index.js";

/**
 * Create a new test drive request.
 */
async function createTestdriveRequest({
  inv_id,
  account_id,
  preferred_date,
  preferred_time,
  contact_phone,
  message,
}) {
  const sql = `
    INSERT INTO public.testdrive_request (
      inv_id,
      account_id,
      preferred_date,
      preferred_time,
      contact_phone,
      message
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      testdrive_id,
      inv_id,
      account_id,
      preferred_date,
      preferred_time,
      contact_phone,
      message,
      status,
      created_at
  `;

  const values = [
    inv_id,
    account_id,
    preferred_date,
    preferred_time,
    contact_phone,
    message || null,
  ];

  const result = await pool.query(sql, values);
  return result.rows[0]; // newly-created request
}

/**
 * Get all test drive requests for a specific account (logged-in user history).
 */
async function getRequestsByAccountId(account_id) {
  const sql = `
    SELECT
      t.testdrive_id,
      t.inv_id,
      t.account_id,
      t.preferred_date,
      t.preferred_time,
      t.contact_phone,
      t.message,
      t.status,
      t.created_at,
      i.inv_make,
      i.inv_model,
      i.inv_year,
      i.inv_image
    FROM public.testdrive_request AS t
    JOIN public.inventory AS i
      ON t.inv_id = i.inv_id
    WHERE t.account_id = $1
    ORDER BY t.created_at DESC
  `;
  const data = await pool.query(sql, [account_id]);
  return data.rows;
}

/**
 * Get all test drive requests (for management/admin view).
 * Joins inventory + account so the view shows real info.
 */
async function getAllRequests() {
  const sql = `
    SELECT
      t.testdrive_id,
      t.inv_id,
      t.account_id,
      t.preferred_date,
      t.preferred_time,
      t.contact_phone,
      t.message,
      t.status,
      t.created_at,
      i.inv_make,
      i.inv_model,
      i.inv_year,
      i.inv_image,
      a.account_firstname,
      a.account_lastname,
      a.account_email
    FROM public.testdrive_request AS t
    JOIN public.inventory AS i
      ON t.inv_id = i.inv_id
    JOIN public.account AS a
      ON t.account_id = a.account_id
    ORDER BY t.created_at DESC
  `;
  const data = await pool.query(sql);
  return data.rows;
}

/**
 * Update the status of a test drive request.
 * e.g. "Pending" -> "Confirmed" / "Completed" / "Cancelled"
 */
async function updateTestdriveStatus(testdrive_id, newStatus) {
  const sql = `
    UPDATE public.testdrive_request
    SET status = $1
    WHERE testdrive_id = $2
    RETURNING testdrive_id, status
  `;
  const result = await pool.query(sql, [newStatus, testdrive_id]);
  return result.rows[0] || null; // null if nothing updated
}

const testdriveModel = {
  createTestdriveRequest,
  getRequestsByAccountId,
  getAllRequests,
  updateTestdriveStatus,
};

export default testdriveModel;
