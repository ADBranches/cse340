// middleware/authMiddleware.js
// CSE Motors – Authentication and Authorization Middleware

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * verifyToken
 * - Verifies JWT if present.
 * - Attaches decoded user data to req.account and res.locals.account.
 * - Clears invalid or expired tokens without interrupting public pages.
 */
export function verifyToken(req, res, next) {
  const token = req.cookies?.jwt;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.account = decoded;
    res.locals.account = decoded;
  } catch (err) {
    console.warn("JWT validation error:", err.message);
    res.clearCookie("jwt");
  }

  next();
}

/**
 * requireAuth
 * - Ensures a user is authenticated.
 * - Redirects unauthenticated users to the login page.
 */
export function requireAuth(req, res, next) {
  if (!req.account) {
    req.flash("error", "Please log in to continue.");
    return res.redirect("/account/login");
  }
  next();
}

/**
 * requireRole
 * - Restricts access based on allowed roles (e.g., ["Admin", "Employee"])
 */
export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.account || !roles.includes(req.account.account_type)) {
      req.flash("error", "Access denied.");
      return res.redirect("/account/management");
    }
    next();
  };
}

/**
 * globalAuthContext
 * - Makes account information available to all EJS templates.
 */
export function globalAuthContext(req, res, next) {
  res.locals.account = req.account || null;
  next();
}
