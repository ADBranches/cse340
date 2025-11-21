// controllers/inventoryController.js

import { getAllVehicles, getVehicleById } from "../data/vehicles.js";

/**
 * Controller: Show all vehicles in inventory
 * Uses DB-like model function getAllVehicles()
 */
export function showInventory(req, res, next) {
  try {
    const items = getAllVehicles();

    res.render("layout", {
      title: "Inventory",
      view: "inventory",
      items
    });
  } catch (err) {
    next(err); // forwards to global error middleware
  }
}

/**
 * Controller: Show details for a single vehicle
 * Uses DB-like model function getVehicleById()
 */
export function showVehicleDetail(req, res, next) {
  try {
    const id = Number(req.params.id);
    const vehicle = getVehicleById(id);

    if (!vehicle) {
      return res.status(404).render("layout", {
        title: "Vehicle Not Found",
        view: "errors/404"
      });
    }

    res.render("layout", {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      view: "vehicle-details",
      vehicle
    });
  } catch (err) {
    next(err); // forwards to error middleware
  }
}
export function buildManagement(req, res) {
  let nav = utilities.getNav()
  res.render("inventory-management", {
    title: "Inventory Management",
    nav,
    errors: null,
    messages: req.flash("notice")
  })
}

/**
 * Controller: Inventory Management Dashboard
 * Delivers /inv/ page
 */
export function buildManagementView(req, res) {
  try {
    const nav = req.app.locals.utils.getNav(); // your existing nav builder

    res.render("layout", {
      title: "Inventory Management",
      view: "inventory-management", // NEW VIEW FILE (next step)
      nav,
      messages: null
    });
  } catch (err) {
    console.error("Management View Error:", err);
    res.status(500).render("layout", {
      title: "Server Error",
      view: "errors/500"
    });
  }
}

/**
 * Build Add Classification View
 */
export function buildAddClassification(req, res) {
  const nav = req.app.locals.utils.getNav();

  res.render("layout", {
    title: "Add Classification",
    view: "add-classification",
    nav,
    errors: null,
    messages: req.flash("notice")
  });
}

/**
 * Process Classification Insert
 */
import * as invModel from "../models/inventory-model.js";

// In controllers/inventoryController.js

export async function addClassification(req, res) {
  const { classification_name } = req.body;

  try {
    const result = await invModel.addClassification(classification_name);

    if (result) {
      req.flash("notice", "Classification added successfully!");
      const nav = req.app.locals.utils.getNav();

      return res.render("layout", {
        title: "Inventory Management",
        view: "inventory-management",
        nav,
        errors: null,
        messages: req.flash("notice")
      });
    }

  } catch (err) {
    console.error("Add Classification Error:", err);
    const nav = req.app.locals.utils.getNav();

    // Duplicate key
    if (err.code === "23505") {
      req.flash("notice", "That classification name already exists.");
      return res.render("layout", {
        title: "Add Classification",
        view: "add-classification",
        nav,
        errors: [{ msg: "Classification already exists." }],
        messages: req.flash("notice")
      });
    }

    // Generic DB failure
    req.flash("notice", "Unexpected database error.");
    return res.render("layout", {
      title: "Add Classification",
      view: "add-classification",
      nav,
      errors: [{ msg: "Unexpected server error." }],
      messages: req.flash("notice")
    });
  }
}
