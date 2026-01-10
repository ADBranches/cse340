// controllers/accountController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pool from "../utilities/db.js";

import { updateAccountInfo, updatePassword } from "../models/account-model.js";
import { hashPassword } from "../utilities/auth-utils.js";

dotenv.config();

/** Render Login Page */
export const loginView = (req, res) => {
  res.render("layout", {
    title: "Login - CSE Motors",
    view: "account/login",
    errors: req.flash("error"),
    messages: req.flash("notice")
  });
};

/** Handle Login Authentication */
export const loginAccount = async (req, res) => {
  console.log("🔐 LOGIN ATTEMPT STARTED");
  console.log("📧 Email:", req.body.email);
  console.log("🔑 Password length:", req.body.password?.length);

  try {
    // 1. Database query
    console.log("🔍 Querying database...");
    const userQuery = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [req.body.email]
    );

    console.log("📊 Query results:", userQuery.rows.length);

    if (userQuery.rows.length === 0) {
      console.warn("❌ No user found:", req.body.email);
      if (isAjax) {
        return res.status(401).json({
          success: false,
          message: "No user found with that email.",
        });
      }
      req.flash("error", "No account found with that email.");
      return res.redirect("/account/login");
    }


    const user = userQuery.rows[0];
    console.log("✅ User found:", user.account_email);
    console.log("👤 User type:", user.account_type);

    // 2. bcrypt compare
    console.log("🔑 Comparing password with bcrypt...");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.account_password
    );
    console.log("🔑 Password valid?", validPassword);

    if (!validPassword) {
      console.warn("❌ Invalid password for:", req.body.email);
      if (isAjax) {
        return res.status(403).json({
          success: false,
          message: "Incorrect password.",
        });
      }
      req.flash("error", "Incorrect password.");
      return res.redirect("/account/login");
    }

    // 3. Create JWT
    console.log("🎫 Creating JWT...");
    const tokenPayload = {
      account_id: user.account_id,
      account_firstname: user.account_firstname,
      account_email: user.account_email,
      account_type: user.account_type
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "2h" }
    );

    console.log("✅ JWT created");

    // 4. Set cookie and redirect
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60 * 1000
    });

    if (isAjax) {
      return res.json({
        success: true,
        message: "Login successful.",
      });
    }

    req.flash("notice", `Welcome back, ${user.account_firstname}!`);
    console.log("🔄 Redirecting to /account/management");
    return res.redirect("/account/management");
  } catch (error) {
    console.error("💥 LOGIN ERROR:", error);
    if (isAjax) {
      return res
        .status(500)
        .json({ success: false, message: "Server error during login." });
    }
    req.flash("error", "Login failed. Please try again.");
    return res.redirect("/account/login");

      }
    };

/** Logout – Clear JWT cookie */
export const logoutAccount = (req, res) => {
  console.log("🚪 Logout requested");
  res.clearCookie("jwt");
  req.flash("notice", "Logged out successfully");
  res.redirect("/");
};

/** Render Account Management Page (Enhanced for Phase 3) */
export const managementView = async (req, res) => {
  try {
    const user = req.user || req.account;
    if (!user) {
      req.flash("error", "Please log in to access your dashboard.");
      return res.redirect("/account/login");
    }

    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
      [user.account_id]
    );

    if (result.rows.length === 0) {
      req.flash("error", "Account not found.");
      return res.redirect("/account/login");
    }

    const account = result.rows[0];
    const isPrivileged = ["Admin", "Employee"].includes(account.account_type);

    res.render("layout", {
      title: "Account Management | CSE Motors",
      view: "account/management",
      account,
      isPrivileged,
      notices: req.flash("notice"),
      errors: req.flash("error")
    });
  } catch (err) {
    console.error("⚠️ managementView error:", err);
    req.flash("error", "Unexpected error loading your dashboard.");
    res.redirect("/account/login");
  }
};

/** Render Update Account Form */
export const updateView = async (req, res) => {
  try {
    const accountId = req.params.id;
    const user = req.user || req.account;

    if (parseInt(accountId) !== user.account_id) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/account/management");
    }

    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email FROM account WHERE account_id = $1",
      [accountId]
    );

    if (result.rows.length === 0) {
      req.flash("error", "Account not found");
      return res.redirect("/account/management");
    }

    const account = result.rows[0];

    res.render("layout", {
      title: "Update Account - CSE Motors",
      view: "account/update",
      account,
      errors: req.flash("error"),
      messages: req.flash("notice")
    });
  } catch (err) {
    console.error("❌ Update view error:", err);
    req.flash("error", "Unable to load update form");
    res.redirect("/account/management");
  }
};

/** Handle Account Update */
export const updateAccount = async (req, res) => {
  try {
    const { account_firstname, account_lastname, account_email, account_id } = req.body;
    const user = req.user || req.account;

    if (parseInt(account_id) !== user.account_id) {
      req.flash("error", "Unauthorized update attempt");
      return res.redirect("/account/management");
    }

    const emailCheck = await pool.query(
      "SELECT account_id FROM account WHERE account_email = $1 AND account_id != $2",
      [account_email, account_id]
    );

    if (emailCheck.rows.length > 0) {
      req.flash("error", "Email already in use");
      return res.redirect(`/account/update/${account_id}`);
    }

    await pool.query(
      `UPDATE account 
       SET account_firstname = $1, 
           account_lastname = $2, 
           account_email = $3,
           updated_at = NOW()
       WHERE account_id = $4`,
      [account_firstname, account_lastname, account_email, account_id]
    );

    req.flash("notice", "Account updated successfully!");
    res.redirect("/account/management");
  } catch (err) {
    console.error("❌ Update account error:", err);
    req.flash("error", "Unable to update account");
    res.redirect(`/account/update/${req.body.account_id}`);
  }
};

/** Handle Password Change (Legacy Form Endpoint) */
export const updatePasswordController = async (req, res) => {
  try {
    const { new_password, account_id } = req.body;
    const user = req.user || req.account;

    if (parseInt(account_id) !== user.account_id) {
      req.flash("error", "Unauthorized password change");
      return res.redirect("/account/management");
    }

    if (!new_password || new_password.length < 8) {
      req.flash("error", "Password must be at least 8 characters long");
      return res.redirect(`/account/update/${account_id}`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await pool.query(
      `UPDATE account 
       SET account_password = $1,
           updated_at = NOW()
       WHERE account_id = $2`,
      [hashedPassword, account_id]
    );

    req.flash("notice", "Password updated successfully!");
    res.redirect("/account/management");
  } catch (err) {
    console.error("❌ Update password error:", err);
    req.flash("error", "Unable to update password");
    res.redirect(`/account/update/${req.body.account_id}`);
  }
};

/** Register View (if needed) */
export const registerView = (req, res) => {
  res.render("layout", {
    title: "Register - CSE Motors",
    view: "account/register",
    errors: req.flash("error"),
    messages: req.flash("notice")
  });
};

/** Handle Registration */
export const registerAccount = async (req, res) => {
  try {
    const { first_name, last_name, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/account/register");
    }

    const emailCheck = await pool.query(
      "SELECT account_id FROM account WHERE account_email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      req.flash("error", "Email already registered");
      return res.redirect("/account/register");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      `INSERT INTO account 
       (account_firstname, account_lastname, account_email, account_password, account_type)
       VALUES ($1, $2, $3, $4, 'Client')`,
      [first_name, last_name, email, hashedPassword]
    );

    req.flash("notice", "Registration successful! Please login.");
    res.redirect("/account/login");
  } catch (err) {
    console.error("❌ Registration error:", err);
    req.flash("error", "Registration failed");
    res.redirect("/account/register");
  }
};

/** Process personal info update (Phase 5 Enhanced) */
export const processAccountUpdate = async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const { account_id } = req.account;

  try {
    const isAjax =
      req.xhr ||
      (req.headers["x-requested-with"] &&
        req.headers["x-requested-with"].toLowerCase() === "xmlhttprequest") ||
      (req.headers.accept && req.headers.accept.includes("application/json"));

    await updateAccountInfo(account_id, first_name, last_name, email);
    req.flash("notice", "Account information updated successfully.");
    res.redirect(`/account/update/${account_id}`);
  } catch (err) {
    console.error("⚠️ Account info update failed:", err);
    req.flash("error", "Could not update account information.");
    res.redirect(`/account/update/${account_id}`);
  }
};

/** Process password change (Phase 5 Enhanced) */
export const processPasswordChange = async (req, res) => {
  const { password } = req.body;
  const { account_id } = req.account;

  try {
    const hashed = await hashPassword(password);
    await updatePassword(account_id, hashed);
    req.flash("notice", "Password updated successfully.");
    res.redirect(`/account/update/${account_id}`);
  } catch (err) {
    console.error("⚠️ Password update failed:", err);
    req.flash("error", "Could not update password.");
    res.redirect(`/account/update/${account_id}`);
  }
};
