// routes/inventoryRoute.js
import { Router } from "express";
import { buildVehicleDetail } from "../controllers/inventoryController.js";

const router = Router();

// /inv/detail/1, /inv/detail/2
router.get("/detail/:invId", buildVehicleDetail);

export default router;

