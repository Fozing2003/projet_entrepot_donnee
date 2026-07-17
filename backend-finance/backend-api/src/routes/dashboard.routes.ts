import { Router } from "express";
import * as controller from "../controllers/dashboard.controller";

const router = Router();

router.get("/overview", controller.overview);
router.get("/temporal", controller.temporal);
router.get("/geographic", controller.geographic);
router.get("/agency", controller.agency);
router.get("/channels", controller.channels);
router.get("/strategy", controller.strategy);

export default router;
