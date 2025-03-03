import { Router } from "express";
import { getStatistics } from "../controllers/statisticsController.js";

const router = Router();

router.route("/").get(getStatistics);

export default router;
