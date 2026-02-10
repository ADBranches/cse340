// utilities/auth-middleware.js
import jwt from "jsonwebtoken";

/**
 * Reads JWT from cookie, verifies it, and exposes account data to views via res.locals.
 * Expects:
 *   - cookie name: "jwt"  (change if your login uses a different one)
 *   - secret in: process.env.ACCESS_TOKEN_SECRET
 */
function attachAccountData(req, res, next) {
  // default: not logged in
  res.locals.accountData = null;

  const token = req.cookies?.jwt;
  const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!token || !jwtSecret) {
    return next();
  }

  try {
    const payload = jwt.verify(token, jwtSecret);

    res.locals.accountData = {
      account_id: payload.account_id,
      account_firstname: payload.account_firstname,
      account_type: payload.account_type,
    };

    return next();
  } catch (err) {
    // invalid/expired token → treat as logged out
    res.locals.accountData = null;
    return next();
  }
}
function checkLogin(req, res, next) {
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in to continue.");
    return res.redirect("/account/login");
  }
  return next();
}

function checkEmployeeOrAdmin(req, res, next) {
  const account = res.locals.accountData;

  if (!account) {
    req.flash("notice", "Please log in to continue.");
    return res.redirect("/account/login");
  }

  if (account.account_type === "Employee" || account.account_type === "Admin") {
    return next();
  }

  req.flash("notice", "You are not authorized to view that page.");
  return res.redirect("/account/login");
}

const authMiddleware = {
  attachAccountData,
  checkLogin,
  checkEmployeeOrAdmin,
};


export default authMiddleware;
