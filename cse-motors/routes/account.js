// routes/account.js
import express from "express";
import {
  // Public
  loginView,
  loginAccount,
  logoutAccount,
  registerView,
  registerAccount,

  // Protected
  managementView,
  updateView,
  processAccountUpdate,
  processPasswordChange
} from "../controllers/accountController.js";

import {
  updateAccountRules,
  passwordUpdateRules,
  validate
} from "../utilities/account-validation.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   🟢 PUBLIC ROUTES
================================ */
router.get("/login", loginView);
router.post("/login", loginAccount);
router.get("/logout", logoutAccount);
router.get("/register", registerView);
router.post("/register", registerAccount);

/* ================================
   🔒 PROTECTED ROUTES (JWT required)
================================ */

// Dashboard (Account Management)
router.get("/management", verifyToken, managementView);

// Account Info Update (validated)
router.get("/update/:id", verifyToken, updateView);
router.post(
  "/update",
  verifyToken,
  updateAccountRules,
  validate,
  processAccountUpdate
);

// Password Change (validated)
router.post(
  "/update-password",
  verifyToken,
  passwordUpdateRules,
  validate,
  processPasswordChange
);

export default router;
