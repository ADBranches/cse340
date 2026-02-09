import { Router } from "express";
import {
  buildVehicleDetail,
  buildClassificationView,
  buildManagementView,
} from "../controllers/inventoryController.js";

const router = Router();

// Inventory management home: /inv
router.get("/", buildManagementView);

// /inv/type/1, /inv/type/3  (classification by ID)
router.get("/type/:classificationId", buildClassificationView);

// /inv/detail/1, /inv/detail/2  (single vehicle detail)
router.get("/detail/:invId", buildVehicleDetail);

export default router;
