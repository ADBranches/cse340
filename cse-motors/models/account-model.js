// models/account-model.js

import pool from "../utilities/db.js";

/** Fetch an account by email – used at login. */
export async function findByEmail(email) {
  const sql = `
    SELECT 
      account_id, 
      account_firstname, 
      account_lastname, 
      account_email, 
      account_password, 
      account_type
    FROM account
    WHERE account_email = $1
  `;
  const result = await pool.query(sql, [email]);
  return result.rows[0];
}

/** Fetch an account by id – used in management/update views. */
export async function findById(account_id) {
  const sql = `
    SELECT 
      account_id, 
      account_firstname, 
      account_lastname, 
      account_email, 
      account_type
    FROM account
    WHERE account_id = $1
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows[0];
}

/** Create a new account. */
export async function create(first_name, last_name, email, passwordHash, type = "Client") {
  const sql = `
    INSERT INTO account (
      account_firstname, 
      account_lastname, 
      account_email, 
      account_password, 
      account_type
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING account_id, account_firstname, account_lastname, account_email, account_type
  `;
  const result = await pool.query(sql, [first_name, last_name, email, passwordHash, type]);
  return result.rows[0];
}

/** Update account info */
export async function updateAccountInfo(account_id, first_name, last_name, email) {
  const sql = `
    UPDATE account
       SET account_firstname = $1,
           account_lastname  = $2,
           account_email     = $3,
           updated_at = NOW()
     WHERE account_id = $4
   RETURNING account_id, account_firstname, account_lastname, account_email, account_type
  `;
  const result = await pool.query(sql, [first_name, last_name, email, account_id]);
  return result.rows[0];
}

/** Update password */
export async function updatePassword(account_id, passwordHash) {
  const sql = `
    UPDATE account
       SET account_password = $1,
           updated_at = NOW()
     WHERE account_id = $2
   RETURNING account_id
  `;
  const result = await pool.query(sql, [passwordHash, account_id]);
  return result.rows[0];
}
