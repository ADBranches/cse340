// utilities/account-validation.js
import { body, validationResult } from "express-validator";
import accountModel from "../models/account-model.js";

/**
 * Validation rules for updating account info (name + email)
 */
function updateAccountRules() {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required.")
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters.")
      .isAlpha("en-US", { ignore: " -'" })
      .withMessage("First name must contain only letters."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required.")
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters.")
      .isAlpha("en-US", { ignore: " -'" })
      .withMessage("Last name must contain only letters."),

    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("A valid email address is required.")
      .normalizeEmail()
      .custom(async (email, { req }) => {
        const existing = await accountModel.getAccountByEmail(email);
        const currentId = Number(req.body.account_id);

        // If another account (different id) already has this email, block it
        if (existing && existing.account_id !== currentId) {
          throw new Error("An account with that email already exists.");
        }
        return true;
      }),
  ];
}

/**
 * Validation rules for updating password
 * (same strength as registration)
 */
function updatePasswordRules() {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("New password is required.")
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter.")
      .matches(/\d/)
      .withMessage("Password must contain at least one number.")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character."),
  ];
}

/**
 * Validation rules for login
 */
function loginRules() {
  return [
    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("A valid email address is required.")
      .normalizeEmail(),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
}

/**
 * If login validation fails, re-render login view
 * with sticky email + errors.
 */
async function checkLoginData(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("account/login", {
      title: "Login",
      errors: errors.array(),
      account_email: req.body.account_email,
    });
  }

  return next();
}

/**
 * If account-update validation fails, re-render the update view
 * with sticky fields + errors.
 */
async function checkUpdateAccountData(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
      title: "Edit Account",
      errors: errors.array(),
      account_id: req.body.account_id,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
  }

  return next();
}

/**
 * If password-update validation fails, re-render update view
 * with errors and current account info.
 */
async function checkUpdatePasswordData(req, res, next) {
  const errors = validationResult(req);
  const accountId = Number(req.body.account_id);

  if (!errors.isEmpty()) {
    const account = await accountModel.getAccountById(accountId);

    return res.status(400).render("account/update", {
      title: "Edit Account",
      errors: errors.array(),
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
    });
  }

  return next();
}

const accountValidate = {
  updateAccountRules,
  updatePasswordRules,
  checkUpdateAccountData,
  checkUpdatePasswordData,
  loginRules,
  checkLoginData,
};

export default accountValidate;
