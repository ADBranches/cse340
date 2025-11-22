import express from "express";
import * as invController from "../controllers/inventoryController.js";
import * as invModel from "../models/inventory-model.js";
import invValidate from "../utilities/inventory-validation.js";
import { buildClassificationSelect } from "../utilities/classificationSelect.js";

// NEW IMPORTS for Multer + Sharp
import { upload } from "../utilities/upload.js";
import { processVehicleImages } from "../utilities/image.js";

const router = express.Router();

/* ================================
   INVENTORY MANAGEMENT HOME
================================ */
router.get("/", invController.buildManagementView);

/* ================================
   ADD CLASSIFICATION
================================ */
router.get("/add-classification", invController.buildAddClassification);

router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
);

/* ================================
   ADD INVENTORY ITEM
================================ */
router.get("/add-inventory", invController.buildAddInventory);

router.post(
  "/add-inventory",

  // Multer handles file uploads (two fields)
  upload.fields([
    { name: "image_file", maxCount: 1 },
    { name: "thumb_file", maxCount: 1 }
  ]),

  //  Process images → store in /public/uploads/images & /public/uploads/thumbs
  async (req, res, next) => {
    try {

      // Graceful handling of unsupported file types
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
          ...req.body
        });

      }
      const imgFile = req.files?.image_file?.[0];
      const thmFile = req.files?.thumb_file?.[0];

      if (!imgFile || !thmFile) {
        req.flash("notice", "Both image and thumbnail are required.");
        const nav = req.app.locals.utils.getNav();
        const classes = await invModel.getClassifications();
        const classificationList = await (await import("../utilities/classificationSelect.js"))
          .buildClassificationSelect(classes);

        return res.status(400).render("layout", {
          title: "Add Inventory Item",
          view: "add-inventory-content",
          nav,
          classificationList,
          errors: [{ msg: "Please upload both vehicle image and thumbnail." }],
          inv_image: req.body.inv_image || "",
          inv_thumbnail: req.body.inv_thumbnail || "",
          ...req.body
        });

      }

      const baseName = path.parse(imgFile.filename).name;
      const main = await processVehicleImages(imgFile.path, baseName);

      const thumbBase = path.parse(thmFile.filename).name + "_manual";
      const thumbProcessed = await processVehicleImages(thmFile.path, thumbBase);

      // Injecting web paths into req.body for DB
      req.body.inv_image = main.imagePath;
      req.body.inv_thumbnail = thumbProcessed.thumbPath;

      next(); // continuing to validation and DB save
    } catch (err) {
      console.error("Image processing error:", err);
      req.flash("notice", "Image processing failed.");

      const nav = req.app.locals.utils.getNav();
      const classes = await invModel.getClassifications();
      const classificationList = await (await import("../utilities/classificationSelect.js"))
        .buildClassificationSelect(classes);

      return res.status(500).render("layout", {
        title: "Add Inventory Item",
        view: "add-inventory-content",
        nav,
        classificationList,
        errors: [{ msg: "Server failed to process images." }],
        inv_image: req.body.inv_image || "",
        inv_thumbnail: req.body.inv_thumbnail || "",
        ...req.body
      });
    }
  },

  //  Validate text fields
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,

  // Save to DB
  invController.addInventory
);


export default router;
