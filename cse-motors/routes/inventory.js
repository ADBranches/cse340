// routes/inventory.js
/**
 * CSE Motors – Inventory Routes
 * Combines role-based access control with existing image-processing logic.
 */

import express from "express";
import path from "path";
import * as invController from "../controllers/inventoryController.js";
import * as invModel from "../models/inventory-model.js";
import invValidate from "../utilities/inventory-validation.js";
import { buildClassificationSelect } from "../utilities/classificationSelect.js";
import { upload } from "../utilities/upload.js";
import { processVehicleImages } from "../utilities/image.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   INVENTORY MANAGEMENT HOME
   (Public list – accessible to everyone)
================================ */
router.get("/", invController.buildManagementView);

/* ================================
   ADD CLASSIFICATION
   (Protected: Admin / Employee only)
================================ */
router.get(
  "/add-classification",
  requireRole(["Admin", "Employee"]),
  invController.buildAddClassification
);

router.post(
  "/add-classification",
  requireRole(["Admin", "Employee"]),
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
);

/* ================================
   ADD INVENTORY ITEM
   (Protected: Admin / Employee only)
================================ */
router.get(
  "/add-inventory",
  requireRole(["Admin", "Employee"]),
  invController.buildAddInventory
);

router.post(
  "/add-inventory",
  requireRole(["Admin", "Employee"]),

  // 🔹 Handle file uploads (Multer)
  upload.fields([
    { name: "image_file", maxCount: 1 },
    { name: "thumb_file", maxCount: 1 },
  ]),

  // 🔹 Process images before validation
  async (req, res, next) => {
    try {
      if (req.fileValidationError) {
        req.flash("error", req.fileValidationError);
        const nav = req.app.locals.utils.getNav();
        const classes = await invModel.getClassifications();
        const classificationList = buildClassificationSelect(classes);

        return res.status(400).render("layout", {
          title: "Add Inventory Item",
          view: "add-inventory-content",
          nav,
          classificationList,
          errors: [{ msg: req.fileValidationError }],
          inv_image: req.body.inv_image || "",
          inv_thumbnail: req.body.inv_thumbnail || "",
          ...req.body,
        });
      }

      const imgFile = req.files?.image_file?.[0];
      const thmFile = req.files?.thumb_file?.[0];

      if (!imgFile || !thmFile) {
        req.flash("notice", "Both image and thumbnail are required.");
        const nav = req.app.locals.utils.getNav();
        const classes = await invModel.getClassifications();
        const classificationList = buildClassificationSelect(classes);

        return res.status(400).render("layout", {
          title: "Add Inventory Item",
          view: "add-inventory-content",
          nav,
          classificationList,
          errors: [{ msg: "Please upload both vehicle image and thumbnail." }],
          inv_image: req.body.inv_image || "",
          inv_thumbnail: req.body.inv_thumbnail || "",
          ...req.body,
        });
      }

      // 🔹 Process and store images
      const baseName = path.parse(imgFile.filename).name;
      const main = await processVehicleImages(imgFile.path, baseName);

      const thumbBase = path.parse(thmFile.filename).name + "_manual";
      const thumbProcessed = await processVehicleImages(thmFile.path, thumbBase);

      req.body.inv_image = main.imagePath;
      req.body.inv_thumbnail = thumbProcessed.thumbPath;

      next();
    } catch (err) {
      console.error("Image processing error:", err);
      req.flash("notice", "Image processing failed.");

      const nav = req.app.locals.utils.getNav();
      const classes = await invModel.getClassifications();
      const classificationList = buildClassificationSelect(classes);

      return res.status(500).render("layout", {
        title: "Add Inventory Item",
        view: "add-inventory-content",
        nav,
        classificationList,
        errors: [{ msg: "Server failed to process images." }],
        inv_image: req.body.inv_image || "",
        inv_thumbnail: req.body.inv_thumbnail || "",
        ...req.body,
      });
    }
  },

  // 🔹 Validate and save to DB
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory
);

/* ================================
   EDIT / UPDATE INVENTORY
   (Protected: Admin / Employee only)
================================ */
router.get(
  "/edit/:inv_id",
  requireRole(["Admin", "Employee"]),
  invController.editInventoryView
);

router.post(
  "/update",
  requireRole(["Admin", "Employee"]),
  invController.updateInventory
);

/* ================================
   DELETE INVENTORY
   (Protected: Admin / Employee only)
================================ */
router.get(
  "/delete/:inv_id",
  requireRole(["Admin", "Employee"]),
  invController.deleteInventoryView
);

router.post(
  "/delete",
  requireRole(["Admin", "Employee"]),
  invController.deleteInventory
);

export default router;
