import mongoose from "mongoose";

const userlistSchema = new mongoose.Schema({
  myemail: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  online: {
    type: String,
    required: true,
  }
});

export default mongoose.model("Userlist", userlistSchema);
