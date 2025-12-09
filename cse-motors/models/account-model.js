// models/account-model.js
/**
 * Account Model – CSE Motors
 * All database interactions for user accounts use parameterized queries
 * for maximum security and deployment readiness.
 */

import pool from "../utilities/db.js";

/**
 * Fetch an account by email – used at login.
 */
export async function findByEmail(email) {
  const sql = `
    SELECT account_id, first_name, last_name, email, password, account_type
    FROM account
    WHERE email = $1
  `;
  const result = await pool.query(sql, [email]);
  return result.rows[0];
}

/**
 * Fetch an account by id – used in management/update views.
 */
export async function findById(account_id) {
  const sql = `
    SELECT account_id, first_name, last_name, email, account_type
    FROM account
    WHERE account_id = $1
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows[0];
}

/**
 * Update basic user details.
 */
export async function updateInfo(account_id, first_name, last_name, email) {
  const sql = `
    UPDATE account
       SET first_name = $1,
           last_name  = $2,
           email      = $3,
           updated_at = NOW()
     WHERE account_id = $4
   RETURNING account_id, first_name, last_name, email, account_type
  `;
  const result = await pool.query(sql, [first_name, last_name, email, account_id]);
  return result.rows[0];
}

/**
 * Create a new account (used for initial seeding / registration).
 */
export async function create(first_name, last_name, email, passwordHash, type = "Client") {
  const sql = `
    INSERT INTO account (first_name, last_name, email, password, account_type)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING account_id, first_name, last_name, email, account_type
  `;
  const result = await pool.query(sql, [first_name, last_name, email, passwordHash, type]);
  return result.rows[0];
}

/**
 * Update account info (first name, last name, email)
 * Uses parameterized query for SQL-injection protection.
 */
export async function updateAccountInfo(account_id, first_name, last_name, email) {
  const sql = `
    UPDATE account
       SET first_name = $1,
           last_name  = $2,
           email      = $3,
           updated_at = NOW()
     WHERE account_id = $4
   RETURNING account_id, first_name, last_name, email, account_type
  `;
  const result = await pool.query(sql, [first_name, last_name, email, account_id]);
  return result.rows[0];
}

/**
 * Update account password (hashed)
 */
export async function updatePassword(account_id, passwordHash) {
  const sql = `
    UPDATE account
       SET password   = $1,
           updated_at = NOW()
     WHERE account_id = $2
   RETURNING account_id
  `;
  const result = await pool.query(sql, [passwordHash, account_id]);
  return result.rows[0];
}
