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
