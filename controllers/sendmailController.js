import nodemailer from "nodemailer";

const sendEmail = async (transporter, mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const sendmailController = async (req, res) => {
  try {
    const { email, sendermail } = req.query;
    mailer(email, sendermail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mailer = async (email, sendermail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Chitchat.chir@gmail.com",
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Chitchat.chir@gmail.com",
    to: email,
    subject: `New Message from an ${sendermail}`,
    text: `Hello ${email},

    You've received a new message from an ${sendermail}.
    
    To start chatting with ${sendermail}, please add them to your Chit-Chat user list.
    
    Thank you for using Chit-Chat!
    
    Best regards,
    Chit-Chat Team`,
  };

  await sendEmail(transporter, mailOptions);
};

export { sendmailController };
