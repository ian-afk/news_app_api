import News from "../models/newModel.js";
import Tags from "../models/tagsModel.js";

export const getStatistics = async (req, res) => {
  try {
    const tags = await Tags.countDocuments();
    const news = await News.countDocuments();
    const newsLikes = await News.aggregate([
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likes" },
          totalDislikes: { $sum: "$dislikes" },
          totalViews: { $sum: "$views" },
        },
      },
    ]);
    res.status(200).json({ success: true, tags, news, newsLikes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
