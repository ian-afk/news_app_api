import mongoose from "mongoose";

const NewsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter news name"],
    },
    description: {
      type: String,
      required: [true, "Please enter description"],
    },
    images: {
      type: String,
      required: [true, "Please upload image"],
    },
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tags",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// MIDDLEWARE TO count view every find by id
NewsSchema.post("findOne", async function (news, next) {
  if (news && this.getOptions().incrementViews) {
    news.views += 1;
    await news.save();
    next();
  }
});

const News = mongoose.model("News", NewsSchema);

export default News;
