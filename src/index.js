import express from "express";
import newsRoute from "./routes/newsRoute.js";
import tagsRoute from "./routes/tagsRoute.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.use("/api/news/", newsRoute);
app.use("/api/tags/", tagsRoute);
app.use("/api/statistic/", (req, res) => {
  res.send("hello from statistic");
});

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => {
    console.log("conntected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });
export default app;
