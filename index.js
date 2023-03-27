const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { userRoutes } = require("./routes/user.route");
const { auth } = require("./middleware/auth.middleware");
const { PostRoutes } = require("./routes/post.route");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use(auth);
app.use("/posts", PostRoutes);

app.listen(process.env.port, async () => {
  try {
    await mongoose.connect(`${process.env.mongo}`);
    console.log("db is connected");
  } catch (error) {
    console.log("db connection failed");
  }
  console.log("port is running on 4500");
});
