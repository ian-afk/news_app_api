import Tags from "../models/tagsModel.js";
import News from "../models/newModel.js";
import mongoose from "mongoose";
export const getListTags = async (req, res) => {
  //   const tags = await Tags.find({});
  const tags = await Tags.aggregate([
    {
      $lookup: {
        from: "news",
        localField: "_id",
        foreignField: "tags",
        as: "newsList",
      },
    },
    {
      $addFields: {
        newsCount: { $size: "$newsList" },
      },
    },
    {
      $project: {
        newsList: 0,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    docs: tags,
  });
};

export const getNewsByTag = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { tagId } = req.params; // Get tagId from request URL

    const totalNews = await News.countDocuments({
      tags: { $in: [tagId] },
    });

    const news = await News.find({
      tags: { $in: [new mongoose.Types.ObjectId(tagId)] },
    })
      .populate("tags")
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
    res.status(500).json({ success: false, message: error.message });
  }
};
