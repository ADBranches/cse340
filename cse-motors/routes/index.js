import express from "express";
import { vehicles } from "../data/vehicles.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("layout", { 
    title: "Home",
    bodyClass: "home",
    view: "index-content",
    featuredVehicles: vehicles.slice(0, 3)
  });
});

router.get("/inventory", (req, res) => {
  console.log("🔥 /inventory route was called.");
  console.log("🔥 Sending view: inventory");
  console.log("🔥 Items count:", vehicles.length);

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

router.get("/inventory/detail/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const vehicle = vehicles.find(v => v.id === id);

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
});

export default router;
