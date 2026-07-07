import { Router } from "express";
import * as controller from "../controllers/query.controller";

const router = Router();


router.post("/", controller.query);

export default router;