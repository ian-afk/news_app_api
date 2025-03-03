import { Router } from "express";
import {
  addNews,
  addNewsMany,
  deleteNews,
  filterByTags,
  getListNews,
  getNews,
  imageUpload,
  likeAndDislike,
  updateNews,
} from "../controllers/newsController.js";

const router = Router();

router.route("/").get(getListNews).post(imageUpload, addNews);
router.route("/many").post(addNewsMany);
router.route("/:id").get(getNews).patch(updateNews).delete(deleteNews);
router.route("/likedis/:id").patch(likeAndDislike);
router.route("/tags/:identifier").get(filterByTags);

export default router;
