// routes/index.js
import { Router } from "express";

const router = Router();

// Home route - renders CSE Motors home view
router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

export default router;

