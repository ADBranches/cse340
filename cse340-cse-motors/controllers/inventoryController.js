// controllers/inventoryController.js
import { getInventoryById } from "../models/inventory-model.js";
import { buildVehicleDetailGrid } from "../utilities/index.js";

/**
 * Controller to build a single vehicle detail view.
 * - Reads the inventory id from the URL.
 * - Fetches that vehicle from the database.
 * - If invalid or missing, passes an error to the error middleware.
 * - On success, renders the inventory detail view with all data.
 *
 /**
 * NOTE:
 * This controller uses buildVehicleDetailGrid (in utilities/index.js)
 * to generate the HTML grid for the detail view.
 */
export async function buildVehicleDetail(req, res, next) {
  try {
    // 1️⃣ Validate and normalize the id from route params
    const invId = Number.parseInt(req.params.invId, 10);

    if (Number.isNaN(invId)) {
      const err = new Error("Invalid vehicle id");
      err.status = 400;
      return next(err);
    }

    // 2️⃣ Ask the model for this vehicle
    const vehicle = await getInventoryById(invId);

    if (!vehicle) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      return next(err);
    }

    // 3️⃣ Prepare data for the view
    const title = `${vehicle.inv_make} ${vehicle.inv_model}`;
    const grid = buildVehicleDetailGrid(vehicle);

    // For now we pass the raw vehicle object.
    // In Phase 4 we'll also pass a `grid` from utilities.buildVehicleDetailGrid(vehicle).
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
