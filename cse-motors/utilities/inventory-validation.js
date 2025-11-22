import { body, validationResult } from "express-validator";
import { buildClassificationList } from "./index.js";
import { getNav } from "./index.js";

export const invValidate = {};

/******************************
 * CLASSIFICATION VALIDATION
 ******************************/

invValidate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must contain only letters with no spaces.")
  ];
};

invValidate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await getNav();
    return res.render("layout", {
      title: "Add Classification",
      view: "add-classification-content",
      nav,
      errors: errors.array(),
      messages: req.flash("notice")
    });
  }

  next();
};

/******************************
 * INVENTORY VALIDATION 
 ******************************/

invValidate.addInventoryRules = () => {
  return [
    body("inv_make").trim().isLength({ min: 1 }).withMessage("Make is required."),
    body("inv_model").trim().isLength({ min: 1 }).withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900 }).withMessage("Year must be valid."),
    body("inv_price").isFloat().withMessage("Price must be a number."),
    body("inv_miles").isInt().withMessage("Miles must be a whole number."),
    body("inv_color").trim().isLength({ min: 1 }).withMessage("Color required."),
    body("classification_id").isInt().withMessage("Please select a classification.")
  ];
};

invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await getNav();
    const classificationList = await buildClassificationList(req.body.classification_id);

    return res.render("layout", {
      title: "Add Inventory Item",
      view: "add-inventory-content",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body
    });
  }

  next();
};

export default invValidate;
