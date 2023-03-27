const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
userRoutes.post("/register", async (req, res) => {
  try {
    let user = req.body;
    let existUser = await UserModel.find({ email: user.email });
    if (existUser.length) {
      res.status(200).send({ msg: "User already exist, please login" });
      return;
    }
    bcrypt.hash(user.password, 3, async (err, hash) => {
      user.password = hash;
      let userRegister = new UserModel(user);
      await userRegister.save();
      res.status(201).send({ msg: "user has been registerd" });
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

userRoutes.post("/login", async (req, res) => {
  try {
    let credentials = req.body;
    let userInDb = await UserModel.findOne({ email: credentials.email });
    console.log(credentials, userInDb);
    bcrypt.compare(
      credentials.password,
      userInDb.password,
      function (err, result) {
        if (result) {
          let token = jwt.sign({ userId: userInDb._id }, "eval");
          res.status(200).send({ msg: "login successful", token: token });
          console.log(token);
          return;
        } else {
          res.status(400).send({ msg: "wrong credentials" });
          return;
        }
      }
    );
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = { userRoutes };
