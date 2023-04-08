const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoute = require("./routes/user");
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/user", userRoute);

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Error connecting to mongodb", +err));

PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
