import Userlistschema from "../models/userlistSchema.js";

const userlist = async (req, res) => {
  try {
    const { email } = req.query;
    const response = await Userlistschema.find({ myemail: email });

    if (response) {
      res.status(200).json({ message: "Fetch successfully", response });
    } else {
      res.status(404).json({ message: "No userlist" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { userlist };
