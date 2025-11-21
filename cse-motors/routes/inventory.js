// routes/inventory.js

import express from "express";
import * as invController from "../controllers/inventoryController.js";
import * as invValidate from "../utilities/inventory-validation.js";

const router = express.Router();

// Inventory Management Dashboard (Task 1)
router.get("/", invController.buildManagementView);

// Add Classification View
router.get("/add-classification", invController.buildAddClassification);

// Process Classification
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
);


export default router;
