import User from "../models/userSchema.js";

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.query;

    const user = await User.findOne({ email });

    if (user) {
      const expireIn = user.expireIn - Date.now();
      if (expireIn < 0) {
        return res.status(400).json({ message: "Your OTP has expired" });
      } else if (user.otp == otp) {
        user.verified = "true";
        await user.save();
        return res.status(200).json({ message: "OTP verified" });
      } else {
        res.status(400).json({ message: "Wrong OTP" });
      }
    } else {
      res.status(404).json({ message: "User not Register" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { verifyOtp };
