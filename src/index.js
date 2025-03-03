import express from "express";
import newsRoute from "./routes/newsRoute.js";
import tagsRoute from "./routes/tagsRoute.js";
import statisticsRoute from "./routes/statisticsRoute.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/news/", newsRoute);
app.use("/api/tags/", tagsRoute);
app.use("/api/statistics/", statisticsRoute);
app.use("/img/news", express.static("public/img/news"));

//global error handler
app.use((err, req, res, next) => {
  if (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
  next();
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
