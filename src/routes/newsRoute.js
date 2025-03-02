import { Router } from "express";
import {
  addNews,
  addNewsMany,
  deleteNews,
  filterByTags,
  getListNews,
  getNews,
  updateNews,
} from "../controllers/newsController.js";

const router = Router();

router.route("/").get(getListNews).post(addNews);
router.route("/many").post(addNewsMany);
router.route("/:id").get(getNews).patch(updateNews).delete(deleteNews);
router.route("/tags/:identifier").get(filterByTags);

export default router;
