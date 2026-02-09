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


const router = Router();

// Add classification form
router.get(
  "/add-classification",
  utilities.handleErrors(buildAddClassification)
);

// Adding inventory form
router.get(
  "/add-inventory",
  utilities.handleErrors(buildAddInventory)
);

// Handling inventory submit
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(registerInventory)
);

// Handle classification submit
router.post(
  "/add-classification",
  invValidate.classRules(),
  invValidate.checkClassData,
  utilities.handleErrors(registerClassification)
);

// Inventory management home: /inv
router.get("/", buildManagementView);

// /inv/type/1, /inv/type/3  (classification by ID)
router.get("/type/:classificationId", buildClassificationView);

// /inv/detail/1, /inv/detail/2  (single vehicle detail)
router.get("/detail/:invId", buildVehicleDetail);

export default router;
