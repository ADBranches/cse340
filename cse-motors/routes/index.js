import express from "express";
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
    view: "inventory"
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

export default router;
