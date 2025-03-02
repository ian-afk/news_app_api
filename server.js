import dotenv from "dotenv";

import app from "./src/index.js";
dotenv.config({ path: "./config.env" });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
