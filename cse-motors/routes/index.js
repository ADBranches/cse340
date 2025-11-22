import express from "express";

import { vehicles } from "../data/vehicles.js";
import {
  showInventory,
  showVehicleDetail
} from "../controllers/inventoryController.js";

import { triggerError } from "../controllers/errorController.js";

const router = express.Router();

// HOME PAGE
router.get("/", (req, res) => {
  res.render("layout", {
    title: "Home",
    view: "index-content",
    featuredVehicles: vehicles.slice(0, 3)
  });
});

// INVENTORY PAGE
router.get("/inventory", showInventory);

// VEHICLE DETAIL PAGE
router.get("/inventory/detail/:id", showVehicleDetail);

// ERROR TEST ROUTE
router.get("/cause-error", triggerError);

// CONTACT
router.get("/contact", (req, res) => {
  res.render("layout", {
    title: "Contact",
    view: "contact"
  });
});

export default router;
