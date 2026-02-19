// utilities/testdrive-validation.js
import { body, validationResult } from "express-validator";
import inventoryModel from "../models/inventory-model.js";

/**
 * Validation rules for the test drive request form.
 * Server-side validation to match our DB + rubric.
 */
const testdriveRules = () => [
  body("preferred_date")
    .trim()
    .notEmpty()
    .withMessage("Preferred date is required.")
    .isISO8601()
    .withMessage("Preferred date must be a valid date."),
  body("preferred_time")
    .trim()
    .notEmpty()
    .withMessage("Preferred time is required."),
  body("contact_phone")
    .trim()
    .notEmpty()
    .withMessage("Contact phone is required.")
    .isLength({ min: 7 })
    .withMessage("Contact phone seems too short."),
  body("message")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Message must be 500 characters or less."),
];

/**
 * Middleware to check validation result.
 * - If OK → next()
 * - If errors → re-render testdrive/request with sticky data + errors
 */
const checkTestdriveData = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      // All good → continue to controller
      return next();
    }

    // We need the vehicle again so the page still shows info
    const invId = Number.parseInt(req.params.invId, 10);
    let vehicle = null;

    if (!Number.isNaN(invId)) {
      vehicle = await inventoryModel.getInventoryById(invId);
    }

    const title = vehicle
      ? `Request Test Drive – ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
      : "Request Test Drive";

    return res.status(400).render("testdrive/request", {
      title,
      errors: errors.array(),
      testdriveData: req.body, // sticky form data
      vehicle,
    });
  } catch (err) {
    return next(err);
  }
};

export { testdriveRules, checkTestdriveData };
