import User from "../models/userSchema.js";
import Userlist from "../models/userlistSchema.js";

const getuser = async (req, res) => {
  try {
    const { email, myemail } = req.query;

    const user = await User.findOne({ email });
    const userlist = await Userlist.findOne({ myemail, email });

    if (user) {
      if (userlist) {
        res.status(500).json({
          message: "User already exist in your list",
        });
      } else if (myemail == email) {
        await Userlist.create({
          myemail: myemail,
          email: email,
          username: "You",
          image: user.image
        });
        res.status(200).json({
          message: "User Present",
          username: "You",
          email: user.email,
          image: user.image
        });
      } else {
        await Userlist.create({
          myemail: myemail,
          email: email,
          username: user.fullname,
          image: user.image
        });
        res.status(200).json({
          message: "User Present",
          username: user.fullname,
          email: user.email,
          image: user.image
        });
      }
    } else {
      res.status(404).json({ message: "User not Exist" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getuser };
