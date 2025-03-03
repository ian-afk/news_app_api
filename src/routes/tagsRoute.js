import { Router } from "express";
import { getListTags, getNewsByTag } from "../controllers/tagsController.js";

const router = Router();

router.route("/").get(getListTags);
router.route("/news/:tagId").get(getNewsByTag);

export default router;
