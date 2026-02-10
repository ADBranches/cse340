import { Router } from "express";
import {
  buildVehicleDetail,
  buildClassificationView,
  buildManagementView,
  buildAddClassification,
  registerClassification,
  buildAddInventory,
  registerInventory,
} from "../controllers/inventoryController.js";
import utilities from "../utilities/index.js";
import invValidate from "../utilities/inventory-validation.js";
import authMiddleware from "../utilities/auth-middleware.js";

const router = Router();

// Add classification form
router.get(
  "/add-classification",
  authMiddleware.checkEmployeeOrAdmin,
  utilities.handleErrors(buildAddClassification)
);


// Adding inventory form
router.get(
  "/add-inventory",
  authMiddleware.checkEmployeeOrAdmin,
  utilities.handleErrors(buildAddInventory)
);

// Handling inventory submit
router.post(
  "/add-inventory",
  authMiddleware.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(registerInventory)
);

// Handle classification submit
router.post(
  "/add-classification",
  authMiddleware.checkEmployeeOrAdmin,
  invValidate.classRules(),
  invValidate.checkClassData,
  utilities.handleErrors(registerClassification)
);


// Inventory management home: /inv
router.get(
  "/",
  authMiddleware.checkEmployeeOrAdmin,
  utilities.handleErrors(buildManagementView)
);

router.get(
  "/type/:classificationId",
  utilities.handleErrors(buildClassificationView)
);

router.get(
  "/detail/:invId",
  utilities.handleErrors(buildVehicleDetail)
);


export default router;
