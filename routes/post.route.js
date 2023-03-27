const express = require("express");
const { PostModel } = require("../model/post.model");
const PostRoutes = express.Router();

PostRoutes.get("/", async (req, res) => {
  try {
    let userId = req.body.userId;
    let posts = await PostModel.find({ userId: userId });
    res.status(200).send(posts);
    console.log(posts);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});
PostRoutes.post("/add", async (req, res) => {
  try {
    let post = new PostModel(req.body);
    await post.save();
    res.status(200).send({ msg: "post has been added" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});
PostRoutes.patch("/update/:postId", async (req, res) => {
  try {
    let { postId } = req.params;
    await PostModel.findByIdAndUpdate({ _id: postId }, req.body);
    res.status(200).send({ msg: "post has been updated" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});
PostRoutes.delete("/delete/:postId", async (req, res) => {
  try {
    let { postId } = req.params;

    let userId = req.body.userId;
    let findPost = await PostModel.findOne({ _id: postId });
    // console.log(userId, findPost);
    if (findPost.userId == userId) {
      await PostModel.findByIdAndDelete({ _id: postId });
      res.status(200).send({ msg: "post has been deleted" });
    } else {
      res.status(400).send({ msg: "you are not the real owner" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = { PostRoutes };
