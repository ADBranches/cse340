// utilities/account-validation.js
import { body, validationResult } from "express-validator";

/**
 * Validation rules for account info update
 */
export const updateAccountRules = [
  body("first_name").trim().notEmpty().withMessage("First name is required."),
  body("last_name").trim().notEmpty().withMessage("Last name is required."),
  body("email")
    .trim()
    .isEmail().withMessage("Valid email required.")
    .normalizeEmail(),
];

/**
 * Validation rules for password update
 */
export const passwordUpdateRules = [
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/).withMessage("Password must include an uppercase letter.")
    .matches(/[a-z]/).withMessage("Password must include a lowercase letter.")
    .matches(/[0-9]/).withMessage("Password must include a number.")
    .matches(/[@$!%*?&]/).withMessage("Password must include a special character."),
  body("confirm_password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
];

/**
 * Generic validation result handler
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    req.flash("error", messages);
    return res.redirect("back");
  }
  next();
}
