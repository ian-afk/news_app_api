import News from "../models/newModel.js";
import Tags from "../models/tagsModel.js";
import mongoose from "mongoose";
import multer from "multer";

// const multerStorage = multer.memoryStorage();
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/news");
  },
  filename: (req, file, cb) => {
    // news-title-time.jpeg
    console.log(req.body);
    const title = req.body.title.trim().replace(/\s+/g, " ").toLowerCase();
    const imgName = title.split("").slice(0, 7).join("").replace(/\s+/g, "");
    console.log(title);
    const ext = file.mimetype.split("/")[1];
    cb(null, `news-${imgName}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  // only accepts image file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    const error = new Error("Not an image");
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const imageUpload = upload.single("images");

export const getListNews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const totalNews = await News.countDocuments();
    const news = await News.find({})
      .populate("tags")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const totalPages = Math.ceil(totalNews / limit);
    res.status(200).json({
      success: true,
      docs: news,
      page: Number(page),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const addNews = async (req, res) => {
  try {
    console.log(req.file);
    const images = req.file ? req.file?.filename : null;
    const { title, description, tags } = req.body;

    const parsedTag = tags
      .split("#")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    if (!tags || tags.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Tags are required" });
    }

    const tagIds = await Promise.all(
      parsedTag.map(async (tag) => {
        const existingTag = await Tags.findOne({ tags: tag });
        if (existingTag) return existingTag._id;

        const newTag = await Tags.create({ tags: tag });
        return newTag._id;
      })
    );
    const news = await News.create({
      title,
      description,
      images,
      tags: tagIds,
    });

    const populatedNews = await News.findById(news._id).populate("tags");
    res.status(201).json({
      success: true,
      doc: populatedNews,
    });
  } catch (error) {
    console.log("dito nag erro");
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNews = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    console.log(id);
    const news = await News.findById(id)
      .populate("tags")
      .setOptions({ incrementViews: true });
    res.status(200).json({
      success: true,
      doc: news,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "News Updated Successfully",
      doc: news,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndDelete(id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "News Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const filterByTags = async (req, res) => {
  try {
    const { identifier } = req.params;
    const tolower = identifier.toLowerCase();
    let tag;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      tag = await Tags.findById(identifier);
    } else
      tag = await Tags.findOne({ tags: { $regex: tolower, $options: "i" } });

    const news = await News.find({ tags: tag._id }).populate("tags");
    res.status(200).json({ success: true, docs: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// likes and dislikes

export const likeAndDislike = async (req, res) => {
  try {
    const { id } = req.params;
    const oldLikeDis = await News.findById(id);

    console.log(oldLikeDis.likes);
    console.log(oldLikeDis.dislikes);
    const { isLike } = req.body;
    console.log(req.body);
    console.log(typeof isLike);
    if (isLike) {
      const likeDis = await News.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        {
          new: true,
          runValidators: true,
        }
      ).setOptions({ incrementViews: false });
      res
        .status(200)
        .json({ success: true, doc: likeDis, message: "Liked successfully" });
    } else {
      const likeDis = await News.findByIdAndUpdate(
        id,
        { $inc: { dislikes: 1 } },
        {
          new: true,
          runValidators: true,
        }
      ).setOptions({ incrementViews: false });
      res
        .status(200)
        .json({ success: true, doc: likeDis, message: "Liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// for data upload only
export const addNewsMany = async (req, res) => {
  try {
    const newsArray = req.body;

    if (!Array.isArray(newsArray) || newsArray.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "News data is required" });
    }

    const allTags = new Set();
    newsArray.forEach(({ tags }) => {
      if (tags) {
        tags
          .split("#")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
          .forEach((tag) => allTags.add(tag));
      }
    });

    const tagDocs = await Promise.all(
      [...allTags].map(async (tag) => {
        let existingTag = await Tags.findOne({ tags: tag });
        if (!existingTag) existingTag = await Tags.create({ tags: tag });
        return { tagName: tag, tagId: existingTag._id };
      })
    );

    const tagMap = tagDocs.reduce((acc, { tagName, tagId }) => {
      acc[tagName] = tagId;
      return acc;
    }, {});

    const newsDocuments = newsArray.map(
      ({ title, description, images = "test", tags }) => ({
        title,
        images,
        description,
        tags: tags
          .split("#")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
          .map((tag) => tagMap[tag]),
      })
    );

    const createdNews = await News.insertMany(newsDocuments);

    const populatedNews = await News.find({
      _id: { $in: createdNews.map((n) => n._id) },
    }).populate("tags");

    res.status(201).json({
      success: true,
      docs: populatedNews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
