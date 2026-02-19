// routes/testdriveRoute.js
import { Router } from "express";
import utilities, {
  testdriveRules,
  checkTestdriveData,
} from "../utilities/index.js";
import authMiddleware from "../utilities/auth-middleware.js";
import {
  buildTestdriveForm,
  processTestdriveRequest,
  buildTestdriveManagement,
  updateTestdriveStatus,
} from "../controllers/testdriveController.js";

const router = Router();

/**
 * GET /test-drive/request/:invId
 * Show the test drive request form (must be logged in).
 */
router.get(
  "/request/:invId",
  authMiddleware.checkLogin,
  utilities.handleErrors(buildTestdriveForm)
);

/**
 * POST /test-drive/request/:invId
 * Validate + process the test drive form.
 */
router.post(
  "/request/:invId",
  authMiddleware.checkLogin,
  testdriveRules(),
  checkTestdriveData, // re-renders form on validation errors
  utilities.handleErrors(processTestdriveRequest)
);

/**
 * GET /test-drive/manage
 * Management page – restrict to Employee/Admin like /inv.
 */
router.get(
  "/manage",
  authMiddleware.checkEmployeeOrAdmin,
  utilities.handleErrors(buildTestdriveManagement)
);

/**
 * POST /test-drive/update-status
 * Simple status update action (also Employee/Admin only).
 */
router.post(
  "/update-status",
  authMiddleware.checkEmployeeOrAdmin,
  utilities.handleErrors(updateTestdriveStatus)
);

export default router;
