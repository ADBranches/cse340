// controllers/inventoryController.js
import inventoryModel from "../models/inventory-model.js";
import utilities from "../utilities/index.js";

/*
 * Controller to build a single vehicle detail view.
 * - Reads the inventory id from the URL.
 * - Fetches that vehicle from the database.
 * - If invalid or missing, passes an error to the error middleware.
 * - On success, renders the inventory detail view with all data.
 *
 /**
 * NB...
 * This controller uses buildVehicleDetailGrid (in utilities/index.js)
 * to generate the HTML grid for the detail view.
 */

 export async function buildManagementView(req, res, next) {
  try {
    return res.render("inventory/management", {
      title: "Vehicle Management",
    });
  } catch (error) {
    return next(error);
  }
}

export async function buildAddClassification(req, res, next) {
  try {
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
    });
  } catch (error) {
    return next(error);
  }
}

export async function buildAddInventory(req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList();
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      classificationList,
    });
  } catch (error) {
    return next(error);
  }
}

export async function registerClassification(req, res, next) {
  try {
    const { classification_name } = req.body || {};

    const newClass = await inventoryModel.addClassification(classification_name);

    if (newClass) {
      req.flash("notice", "The new classification was successfully added.");
      return res.redirect("/inv");
    }

    req.flash("notice", "Sorry, the classification could not be added.");
    return res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      classification_name,
    });
  } catch (error) {
    req.flash("notice", "An error occurred adding the classification.");
    return res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      classification_name: req.body?.classification_name || "",
    });
  }
}

export async function registerInventory(req, res, next) {
  try {
    const vehicleData = req.body;

    const newVehicle = await inventoryModel.addInventory(vehicleData);

    if (newVehicle) {
      req.flash("notice", "The new vehicle was successfully added.");
      return res.redirect("/inv");
    }

    req.flash("notice", "Sorry, the vehicle could not be added.");
  } catch (error) {
    req.flash("notice", "An error occurred adding the vehicle.");
  }

  // If we get here, something failed → re-render with sticky data
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

  const classificationList = await utilities.buildClassificationList(
    classification_id
  );

  return res.status(500).render("inventory/add-inventory", {
    title: "Add New Vehicle",
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

export async function buildVehicleDetail(req, res, next) {
  try {
    // Validate and normalize the id from route params
    const invId = Number.parseInt(req.params.invId, 10);

    if (Number.isNaN(invId)) {
      const err = new Error("Invalid vehicle id");
      err.status = 400;
      return next(err);
    }

    // Ask the model for this vehicle
    const vehicle = await inventoryModel.getInventoryById(invId);

    if (!vehicle) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      return next(err);
    }

    // Prepare data for the view
    const title = `${vehicle.inv_make} ${vehicle.inv_model}`;
    const grid = utilities.buildVehicleDetailGrid(vehicle);

    return res.render("inventory/detail", {
      title,
      vehicle,
      grid,
    });

  } catch (error) {
    // Any unexpected issue (DB down, etc.) flows to global error middleware
    return next(error);
  }
}

// Map classification IDs to friendly titles used in nav
const CLASSIFICATION_TITLES = {
  1: "Custom",
  2: "Sport",
  3: "SUV",
  4: "Truck",
  5: "Sedan",
};

/**
 * Controller to build a classification view.
 * - Reads the classification id from the URL.
 * - Fetches all vehicles in that classification.
 * - On success, renders an inventory list view.
 */
export async function buildClassificationView(req, res, next) {
  try {
    const classificationId = Number.parseInt(
      req.params.classificationId,
      10
    );

    if (Number.isNaN(classificationId)) {
      const err = new Error("Invalid classification id");
      err.status = 400;
      return next(err);
    }

    const vehicles = await inventoryModel.getInventoryByClassificationId(
      classificationId
    );

    if (!vehicles || vehicles.length === 0) {
      const err = new Error("No vehicles found for this classification");
      err.status = 404;
      return next(err);
    }

    const title =
      CLASSIFICATION_TITLES[classificationId] || "Vehicle Classification";

    return res.render("inventory/classification", {
      title,
      vehicles,
    });
  } catch (error) {
    return next(error);
  }
}
