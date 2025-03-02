import mongoose from "mongoose";

const tagsSchema = mongoose.Schema({
  tags: String,
});

const Tags = mongoose.model("Tags", tagsSchema);

export default Tags;
