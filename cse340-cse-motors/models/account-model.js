import pool from "../database/index.js";

/**
 * Fetch a single account by id.
 */
async function getAccountById(account_id) {
  const sql = `
    SELECT
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type
    FROM public.account
    WHERE account_id = $1
  `;
  const data = await pool.query(sql, [account_id]);
  return data.rows[0];
}

/**
 * Fetch an account by email (for login + uniqueness checks).
 * Includes the password hash so bcrypt.compare can work.
 */
async function getAccountByEmail(account_email) {
  const sql = `
    SELECT
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      account_password
    FROM public.account
    WHERE account_email = $1
  `;
  const data = await pool.query(sql, [account_email]);
  return data.rows[0];
}

/**
 * Update account basic info (name + email).
 */
async function updateAccount(account_id, firstname, lastname, email) {
  const sql = `
    UPDATE public.account
    SET
      account_firstname = $1,
      account_lastname  = $2,
      account_email     = $3
    WHERE account_id = $4
    RETURNING
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type
  `;
  const data = await pool.query(sql, [firstname, lastname, email, account_id]);
  return data.rows[0];
}

/**
 * Update account password hash.
 */
async function updatePassword(account_id, hashedPassword) {
  const sql = `
    UPDATE public.account
    SET account_password = $1
    WHERE account_id = $2
  `;
  const result = await pool.query(sql, [hashedPassword, account_id]);
  return result.rowCount; // 1 on success, 0 on failure
}

const accountModel = {
  getAccountById,
  getAccountByEmail,
  updateAccount,
  updatePassword,
};

export default accountModel;
