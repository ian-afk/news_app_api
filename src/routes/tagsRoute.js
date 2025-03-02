import { Router } from "express";
import { getListTags } from "../controllers/tagsController.js";

const router = Router();

router.route("/").get(getListTags);

export default router;
