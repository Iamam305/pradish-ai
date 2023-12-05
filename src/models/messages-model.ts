const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  fileId: {
    type: Schema.Types.ObjectId,
    ref: "UploadFile",
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "system"],
    required: true,
  },
});

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
