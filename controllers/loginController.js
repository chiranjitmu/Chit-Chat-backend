import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import mailer from "../middleware/nodemailer.js";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.query;
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

    const otp = generateOTP();
    const find = await User.findOne({ email });
    if (!find) {
      return res.status(400).json({ message: "Invalid email" });
    }
    //Check entered pass and db pass match by bcryptcompare
    const isPasswordValid = await bcrypt.compare(password, find.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (find.verified === "false") {
      // calling mailer function in middleware
      mailer(email, otp);
      const currentTimestamp = Date.now();
      const futureTimestamp = currentTimestamp + 3.5 * 60 * 1000; // 3.5 minutes in milliseconds
      find.otp = otp;
      find.expireIn = futureTimestamp;
      await find.save();

      return res.status(400).json({ message: "Not verified" });
    }
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "7h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { login };
