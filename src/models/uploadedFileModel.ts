import mongoose from "mongoose";

const upload_file_schema = new mongoose.Schema({
  fileKey: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
  },
  userId: {
    type: String,
  },
});

export const UploadFile =
  mongoose.models.UploadFile ||
  mongoose.model("UploadFile", upload_file_schema);
