import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UploadFile",
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
  },
});

export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
