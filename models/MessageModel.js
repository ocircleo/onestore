const { default: mongoose } = require("mongoose");
const messageSchema = new mongoose.Schema({
  name: { type: String, default: "unknown" },
  email: { type: String, required: true },
  message: { type: String, required: true },
  messageReply: { type: String, default: "" },
  messageDate: { type: Date, default: Date.now },
  state: { type: String, default: "unread", enum: ["unread", "replied"] },
  messageData: { type: Array, default: [] },
});

const MessageModel = mongoose.model("messages", messageSchema);
module.exports = MessageModel;
