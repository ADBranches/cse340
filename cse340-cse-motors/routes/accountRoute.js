// routes/accountRoute.js
import { Router } from "express";
import utilities from "../utilities/index.js";
import authMiddleware from "../utilities/auth-middleware.js";
import accountValidate from "../utilities/account-validation.js";
import {
  buildLoginView,
  processLogin,
  buildAccountManagement,
  buildAccountUpdateView,
  updateAccount,
  updatePassword,
  logoutAccount,
} from "../controllers/accountController.js";

const router = Router();

// Login routes (no auth required)
router.get(
  "/login",
  utilities.handleErrors(buildLoginView)
);

router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(processLogin)
);

// Account Management home: /account
router.get(
  "/",
  authMiddleware.checkLogin,
  utilities.handleErrors(buildAccountManagement)
);

// Edit Account view: /account/edit/:accountId
router.get(
  "/edit/:accountId",
  authMiddleware.checkLogin,
  utilities.handleErrors(buildAccountUpdateView)
);
// Logout: /account/logout
router.get(
  "/logout",
  authMiddleware.checkLogin,
  utilities.handleErrors(logoutAccount)
);

// POST: Update account info
router.post(
  "/update",
  authMiddleware.checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateAccountData,
  utilities.handleErrors(updateAccount)
);

// POST: Update password
router.post(
  "/update-password",
  authMiddleware.checkLogin,
  accountValidate.updatePasswordRules(),
  accountValidate.checkUpdatePasswordData,
  utilities.handleErrors(updatePassword)
);

export default router;
