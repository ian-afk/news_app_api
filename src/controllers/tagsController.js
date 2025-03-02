import Tags from "../models/tagsModel.js";

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
