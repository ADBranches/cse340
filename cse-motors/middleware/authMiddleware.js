// middleware/authMiddleware.js
/**
 * 🔐 CSE Motors – Auth Middleware (Phase 3 Final)
 * Handles JWT verification, global user context, and role-based access.
 */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * ✅ verifyToken
 * - Verifies JWT if present.
 * - Attaches decoded user data to req.account & res.locals.account.
 * - Clears invalid / expired tokens gracefully.
 * - Allows public pages to render even without a token.
 */
export function verifyToken(req, res, next) {
  const token = req.cookies?.jwt;

  // Allow public pages if no token
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.account = decoded;
    res.locals.account = decoded;
  } catch (err) {
    console.warn("JWT expired or invalid:", err.message);
    res.clearCookie("jwt");
    // no redirect here → public pages can still load
  }

  next();
}

/**
 * ✅ requireAuth
 * - Forces authentication for protected routes.
 * - Redirects unauthenticated users to /account/login.
 */
export function requireAuth(req, res, next) {
  if (!req.account) {
    req.flash("error", "Please log in to continue.");
    return res.redirect("/account/login");
  }
  next();
}

/**
 * ✅ requireRole
 * - Restricts access by allowed roles (e.g., ["Admin", "Employee"])
 */
export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.account || !roles.includes(req.account.account_type)) {
      req.flash("error", "Access denied. Authorized personnel only.");
      return res.redirect("/account/management");
    }
    next();
  };
}

/**
 * ✅ globalAuthContext
 * - Injects account info into all templates automatically.
 * - Mount near top of server.js → app.use(globalAuthContext)
 */
export function globalAuthContext(req, res, next) {
  res.locals.account = req.account || null;
  next();
}
