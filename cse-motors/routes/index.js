import express from "express";
import { vehicles } from "../data/vehicles.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("layout", { 
    title: "Home",
    view: "index-content"
  });
});

router.get("/inventory", (req, res) => {
  res.render("layout", { 
    title: "Inventory",
    view: "inventory",
    items: vehicles
  });
});

router.get("/contact", (req, res) => {
  res.render("layout", { 
    title: "Contact",
    view: "contact"
  });
});

router.get("/inventory/:vehicle", (req, res) => {
  const vehicle = req.params.vehicle;
  res.render("layout", { 
    title: vehicle.toUpperCase(),
    view: "vehicle-details",
    vehicle
  });
});

// Vehicle Detail View
router.get("/inventory/detail/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const vehicle = vehicles.find(v => v.id === id);

  if (!vehicle) {
    return res.status(404).render("errors/404", { title: "Vehicle Not Found" });
  }

  res.render("vehicle-details", {
    title: `${vehicle.make} ${vehicle.model}`,
    vehicle
  });
});


export default router;
