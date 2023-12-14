import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderusername: {
    type: String,
    required: true,
  },
  receiverusername: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
});

export default mongoose.model("Message", messageSchema);
