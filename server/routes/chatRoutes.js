const express = require("express");
const { fetchChat } = require("../controllers/chatController");
// const {protect} = require("..")

const router = express.Router();

router.get("/group", fetchChat);

module.exports = router;
