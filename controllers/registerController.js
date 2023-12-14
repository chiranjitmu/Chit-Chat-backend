import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import mailer from "../middleware/nodemailer.js";

const register = async (req, res) => {
  try {
    const { fullname, email, password, image } = req.body;
    // generate otp
    const generateOTP = () => {
      let otp = "";
      const possibleChars = "0123456789";

      for (let i = 0; i < 6; i++) {
        otp += possibleChars.charAt(
          Math.floor(Math.random() * possibleChars.length)
        );
      }
      return otp;
    };

    const find = await User.findOne({ email });
    const findusername = await User.findOne({ fullname });
    if (find) {
      return res.status(500).json({ message: "Email already exists" });
    }
    if (findusername) {
      return res.status(500).json({ message: "Username already exists" });
    }

    const otp = generateOTP();
    const currentTimestamp = Date.now();
    const futureTimestamp = currentTimestamp + 3.5 * 60 * 1000; // 3.5 minutes in milliseconds
    // convert password to hash
    const hashedPassword = await bcrypt.hash(password, 10);
    const registerinfo = await User.create({
      fullname,
      email,
      password: hashedPassword,
      image: image,
      expireIn: futureTimestamp,
      otp: otp,
      verified: "false",
    });
    // calling mailer function in middleware
    mailer(email, otp);
    res.status(200).json({
      message: "signup success",
      registerinfo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { register };
