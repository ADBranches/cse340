import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "CSE Motors Home" });
});

export default router;
