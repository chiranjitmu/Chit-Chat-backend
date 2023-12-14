import User from "../models/userSchema.js";
import mailer from "../middleware/nodemailer.js";

const generateOTP = () => {
  let otp = "";
  const possibleChars = "123456789";

  for (let i = 0; i < 6; i++) {
    otp += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  return otp;
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.query;

    let user = await User.findOne({ email });

    const otp = generateOTP();

    // Call the nodemailer middleware
    mailer(email, otp);

    const currentTimestamp = Date.now();
    const futureTimestamp = currentTimestamp + 3.5 * 60 * 1000; // 3.5 minutes in milliseconds

    user.otp = otp;
    user.expireIn = futureTimestamp;
    await user.save();

    res.status(200).json({ message: "Resend successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: error.message });
  }
};

export { resendOtp };
