// utilities/inventory-validation.js

import { body, validationResult } from "express-validator";
import * as utils from "./index.js";

export const addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must contain only letters (A–Z), no spaces or special characters.")
  ];
};

export const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = utils.getNav();

    return res.render("layout", {
      title: "Add Classification",
      view: "add-classification",
      nav,
      errors: errors.array(),
      messages: req.flash("notice")
    });
  }

  next();
};
