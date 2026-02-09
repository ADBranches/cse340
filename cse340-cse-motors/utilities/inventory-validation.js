// utilities/inventory-validation.js
import { body, validationResult } from "express-validator";
import utilities from "../utilities/index.js";

function classRules() {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isAlphanumeric()
      .withMessage("Classification name must be letters and numbers only, no spaces."),
  ];
}

function inventoryRules() {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required."),
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_year")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be a valid 4-digit year."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
  ];
}

async function checkClassData(req, res, next) {
  const errors = validationResult(req);
  const { classification_name } = req.body;

  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      errors: errors.array(),
      classification_name,
    });
  }

  return next();
}

async function checkInventoryData(req, res, next) {
  const errors = validationResult(req);
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );

    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      errors: errors.array(),
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
  }

  return next();
}

const invValidate = {
  classRules,
  checkClassData,
  inventoryRules,
  checkInventoryData,
};

export default invValidate;
