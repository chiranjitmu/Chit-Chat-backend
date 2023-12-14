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

  const mailer = async (email, otp) => {
    
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
        subject: "Your Chit-Chat OTP",
        text: `Dear ${email},

        Thank you for choosing Chit-Chat! To ensure the security of your 
        account, we have generated a One-Time Password (OTP) for you.
        
        Your OTP: ${otp}
        
        Please use this OTP to complete the authentication process. It is valid 
        for a single use and will expire in [3 min].
        
        If you did not request this OTP or have any concerns about your account 
        security, please contact our support team immediately at [Chitchat.chir@gmail.com].
        
        Thank you for using Chit-Chat!
        
        Best regards,
        The Chit-Chat Team`,
      };
  
      await sendEmail(transporter, mailOptions);
  
  }

  export default mailer;