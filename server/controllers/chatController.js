const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

module.exports.fetchChat = async (req, res) => {
  try {
    const { groupName, from } = req.body;
    const chat = await Chat.find({ name: groupName });
    const messages = await Message.find({
      groupName: chat.name,
    }).sort({ updatedAt: 1 });

    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString === from,
        message: msg.message.text,
        time: msg.createdAt,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};

module.exports.createGroup = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res.status(400).json({ message: "More than 2 users required" });
    }

    const chat = new Chat({
      name: req.body.name,
      users: users,
      groupAdmin: req.user,
    });
    res.json(chat);
  } catch (err) {
    next(err);
  }
};
