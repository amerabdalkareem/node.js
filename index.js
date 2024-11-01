require("dotenv").config();
const express = require("express");
const app = express();

const path = require("path");
const cors = require("cors");
const httpStatusText = require("./utils/httpStatusText");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
  console.log("mongoose is connected");
});

app.use(cors());
app.use(express.json());

const aboutRouter = require("./routes/About.Route"); // /api/about
const userRouter = require("./routes/User.Route"); // /api/user

app.use("/api/about", aboutRouter);
app.use("/api/users", userRouter);

// global middleware for not found routes
app.all("*", (request, response, next) => {
  return response.status(404).json({
    status: httpStatusText.ERROR,
    message: "Not Found",
  });
});

// global middleware for handler
app.use((error, request, response, next) => {
  response.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Listen On Port 4000");
});
