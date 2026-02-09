import { Router } from "express";
import { triggerTestError } from "../controllers/errorController.js";

const router = Router();

// GET /error-test 
router.get("/error-test", triggerTestError);

export default router;
