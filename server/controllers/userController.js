const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const axios = require("axios");
// const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userCheck = await User.findOne({ username });
    const emailCheck = await User.findOne({ email });

    if (userCheck)
      return res.json({ msg: "Username already used", status: false });
    if (emailCheck)
      return res.json({ msg: "Email already exists", status: false });

    const hashpw = await bcrypt.hash(password, 12);
    const api = "https://api.dicebear.com/6.x/avataaars/svg";
    const image = await axios.get(`${api}`);
    const user = new User({
      username,
      email,
      password: hashpw,
      avatarImage: "https://api.dicebear.com/6.x/avataaars/svg",
      isAvatarImageSet: true,
    });
    await user.save();
    // const token = jwt.sign(username, process.env.JWT_SECRET_KEY);
    // res.cookie("user", token, { maxAge: 7 * 24 * 3600000 });
    return res.json({ status: true, user: user });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res.json({ msg: "Incorrect username or password", status: false });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.json({ msg: "Incorrect username or password", status: false });
    // const token = jwt.sign(username, process.env.JWT_SECRET_KEY);
    // res.cookie("user", token, { maxAge: 7 * 24 * 3600000 });
    return res.json({ status: true, user: user });
  } catch (err) {
    next(err);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    // console.log("got to controller");
    const users = await User.find({ _id: { $ne: req.params.id } });
    // .select([
    //   "email",
    //   "username",
    //   "avatarImage",
    //   "_id",
    // ]);
    // console.log(users);
    return res.json(users);
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports.searchUser = async (req, res, next) => {
  // const q = req.query.search ? {
  //   {name: {$regex: req.query.search; $options:"i"}}
  // }:{};
  // console.log(req.params);
  if (req.params) {
    // const q = { name: { $regex: req.params.query, $options: "i" } };
    const regexPattern = new RegExp(`^${req.params.query}`);
    const q = {
      $and: [
        { username: { $regex: regexPattern } },
        { _id: { $ne: req.params.id } },
      ],
    };
    // console.log(q);

    const users = await User.find(q);
    console.log(users);
    return res.json(users);
  }
  // req.query.search ? {
  //   const q = {name: {$regex: req.query.search, $options:"i"}}
  // }:{};
  // const uesrs = await User.find(q).find({_id: {$ne: req.user._id}});
};
