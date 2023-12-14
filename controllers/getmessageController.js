import Messageschema from "../models/messageSchema.js";

const message = async (req, res) => {
  try {
    const { email1, email2 } = req.query;
    const response = await Messageschema.find({
      $or: [
        { senderusername: email1, receiverusername: email2 },
        { senderusername: email2, receiverusername: email1 }
      ]
    });
    
    if (response) {
      res.status(200).json({ message: "Fetch successfully", response });
    } else {
      res.status(404).json({ message: "No message found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { message };
