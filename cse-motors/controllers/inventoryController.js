// controllers/inventoryController.js

import { getAllVehicles, getVehicleById } from "../data/vehicles.js";
import * as invModel from "../models/inventory-model.js";
import { buildClassificationSelect } from "../utilities/classificationSelect.js";
import { requireRole } from "../middleware/authMiddleware.js";

// =============================
// SHOW INVENTORY LIST
// =============================
export function showInventory(req, res, next) {
  try {
    const items = getAllVehicles();

    res.render("layout", {
      title: "Inventory",
      view: "inventory",
      items
    });
  } catch (err) {
    next(err);
  }
}

// =============================
// SHOW SINGLE VEHICLE
// =============================
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
    next(err);
  }
}

// =============================
// INVENTORY MANAGEMENT DASHBOARD
// =============================
export function buildManagementView(req, res) {
  try {
    const nav = req.app.locals.utils.getNav();

    res.render("layout", {
      title: "Inventory Management",
      view: "inventory-management",
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

// =============================
// ADD CLASSIFICATION VIEW
// =============================
export function buildAddClassification(req, res) {
  const nav = req.app.locals.utils.getNav();
  if (!req.account || !["Admin", "Employee"].includes(req.account.account_type)) {
    req.flash("error", "Access denied: Admin or Employee role required.");
    return res.redirect("/account/management");
  }

  res.render("layout", {
    title: "Add Classification",
    view: "add-classification-content",
    nav,
    errors: null,
    messages: req.flash("notice")
  });
}

// =============================
// PROCESS CLASSIFICATION INSERT
// =============================
export async function addClassification(req, res) {
  const { classification_name } = req.body;
  if (!req.account || !["Admin", "Employee"].includes(req.account.account_type)) {
    req.flash("error", "Access denied: Admin or Employee role required.");
    return res.redirect("/account/management");
  }

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

    if (err.code === "23505") {
      return res.render("layout", {
        title: "Add Classification",
        view: "add-classification-content",
        nav,
        errors: [{ msg: "Classification already exists." }],
        messages: req.flash("notice")
      });
    }

    return res.render("layout", {
      title: "Add Classification",
      view: "add-classification-content",
      nav,
      errors: [{ msg: "Unexpected server error." }],
      messages: req.flash("notice")
    });
  }
}

// =============================
// ADD INVENTORY VIEW
// =============================
export async function buildAddInventory(req, res) {
  // Inline Authorization Check
  if (!req.account || !["Admin", "Employee"].includes(req.account.account_type)) {
    req.flash("error", "Access denied: Admin or Employee role required.");
    return res.redirect("/account/management");
  }

  try {
    const classifications = await invModel.getClassifications();
    const nav = req.app.locals.utils.getNav();

    const classificationList = buildClassificationSelect(classifications);

    res.render("layout", {
      title: "Add Inventory Item",
      view: "add-inventory-content",
      nav,
      classificationList,
      errors: null,
      messages: req.flash("notice"),

      // DEFAULT VALUES FOR THE FORM FIELDS
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: "",
    });

  } catch (err) {
    console.error("❌ Error loading Add Inventory page:", err);
    res.status(500).render("layout", {
      title: "Server Error",
      view: "errors/500",
      message: "Unable to load the add inventory form."
    });
  }
}

// =============================
// PROCESS INVENTORY INSERT
// =============================
export async function addInventory(req, res) {
  if (!req.account || !["Admin", "Employee"].includes(req.account.account_type)) {
    req.flash("error", "Access denied: Admin or Employee role required.");
    return res.redirect("/account/management");
  } 

  try {
    const saved = await invModel.addInventory(req.body);

    if (saved) {
      req.flash("notice", "Inventory item added successfully!");
      return res.redirect("/inv/");
    }

    req.flash("notice", "Failed to add inventory item.");
    return res.redirect("/inv/add-inventory");

  } catch (err) {
    console.error("❌ Error saving inventory:", err);

    const classifications = await invModel.getClassifications();
    const nav = req.app.locals.utils.getNav();
    const classificationList = buildClassificationSelect(classifications);

    req.flash("error", "Unexpected server error while saving inventory.");

    res.status(500).render("layout", {
      title: "Add Inventory Item",
      view: "add-inventory-content",
      nav,
      classificationList,
      errors: [{ msg: "Unexpected server error while saving inventory." }],
      ...req.body
    });
  }
}
// =============================
// EDIT INVENTORY VIEW
// =============================
export async function editInventoryView(req, res) {
  if (!req.account || !["Admin", "Employee"].includes(req.account.account_type)) {
    req.flash("error", "Access denied: Admin or Employee role required.");
    return res.redirect("/account/management");
  }

  try {
    const invId = req.params.inv_id;
    const vehicle = await invModel.getInventoryById(invId);
    const classifications = await invModel.getClassifications();
    const nav = req.app.locals.utils.getNav();
    const classificationList = buildClassificationSelect(classifications, vehicle.classification_id);

    if (!vehicle) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/inv/");
    }

    res.render("layout", {
      title: `Edit ${vehicle.inv_make} ${vehicle.inv_model}`,
      view: "edit-inventory-content",
      nav,
      classificationList,
      vehicle,
      errors: null,
      messages: req.flash("notice")
    });
  } catch (err) {
    console.error("❌ Edit Inventory View Error:", err);
    res.status(500).render("layout", {
      title: "Server Error",
      view: "errors/500",
      message: "Unable to load edit form."
    });
  }
}

// =============================
// UPDATE INVENTORY RECORD
// =============================
export async function updateInventory(req, res) {
  if (!req.account || !["Admin", "Employee"].includes(req.account.account_type)) {
    req.flash("error", "Access denied: Admin or Employee role required.");
    return res.redirect("/account/management");
  }

  try {
    const updated = await invModel.updateInventory(req.body);

    if (updated) {
      req.flash("notice", "Inventory item updated successfully!");
      return res.redirect("/inv/");
    }

    req.flash("error", "Failed to update inventory item.");
    res.redirect(`/inv/edit/${req.body.inv_id}`);
  } catch (err) {
    console.error("❌ Update Inventory Error:", err);
    req.flash("error", "Unexpected server error while updating inventory.");
    res.redirect(`/inv/edit/${req.body.inv_id}`);
  }
}

// =============================
// DELETE INVENTORY VIEW
// =============================
export async function deleteInventoryView(req, res) {
  if (!req.account || !["Admin", "Employee"].includes(req.account.account_type)) {
    req.flash("error", "Access denied: Admin or Employee role required.");
    return res.redirect("/account/management");
  }

  try {
    const invId = req.params.inv_id;
    const vehicle = await invModel.getInventoryById(invId);
    const nav = req.app.locals.utils.getNav();

    if (!vehicle) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/inv/");
    }

    res.render("layout", {
      title: "Confirm Delete",
      view: "delete-inventory-content",
      nav,
      vehicle,
      errors: null,
      messages: req.flash("notice")
    });
  } catch (err) {
    console.error("❌ Delete View Error:", err);
    res.status(500).render("layout", {
      title: "Server Error",
      view: "errors/500",
      message: "Unable to load delete confirmation."
    });
  }
}

// =============================
// DELETE INVENTORY ACTION
// =============================
export async function deleteInventory(req, res) {
  if (!req.account || !["Admin", "Employee"].includes(req.account.account_type)) {
    req.flash("error", "Access denied: Admin or Employee role required.");
    return res.redirect("/account/management");
  }

  try {
    const deleted = await invModel.deleteInventory(req.body.inv_id);

    if (deleted) {
      req.flash("notice", "Inventory item deleted successfully!");
      return res.redirect("/inv/");
    }

    req.flash("error", "Failed to delete inventory item.");
    res.redirect("/inv/");
  } catch (err) {
    console.error("❌ Delete Inventory Error:", err);
    req.flash("error", "Unexpected server error while deleting inventory.");
    res.redirect("/inv/");
  }
}

