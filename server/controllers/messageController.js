const Message = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = new Message({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    await data.save();
    if (data) return res.json({ msg: "Message added successfully" });
    return res.json({ msg: "Failed to add msg" });
  } catch (err) {
    next(err);
  }
};
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    console.log(messages);
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        time: msg.createdAt,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};
