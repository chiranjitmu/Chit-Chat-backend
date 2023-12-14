import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  expireIn: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  verified: {
    type: String,
    required: true
  },
});

export default mongoose.model("User", userSchema);
