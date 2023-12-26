import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import registerRouter from "./routes/registerRoutes.js";
import loginRouter from "./routes/loginRoutes.js";
import verifyRouter from "./routes/verifyotpRoutes.js";
import resendRouter from "./routes/resendotpRoutes.js";
import getuserRouter from "./routes/getuserRoutes.js";
import getmessageRouter from "./routes/getmessageRoutes.js";
import Messageschema from "./models/messageSchema.js";
import UserlistSchema from "./models/userlistSchema.js";
import getuserlistRouter from "./routes/getuserlistRoutes.js";
import sendmailRouter from "./routes/sendmailRoutes.js";

// appconfig
const app = express();
dotenv.config();
const port1 = process.env.PORT1;
const server = http.createServer(app);

// middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(bodyParser.json());

// socket initialize
const io = new Server(server, {
  cors: {
    origin: "https://chitchat-chir.netlify.app",
    methods: ["GET", "POST"],
  },
});

// dbconnect
mongoose.connect(process.env.MONGO_CONNECTION, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// Routes
app.use("/api/v1/register", registerRouter);
app.use("/api/v1/login", loginRouter);
app.use("/api/v1/otp-verify", verifyRouter);
app.use("/api/v1/resend-otp", resendRouter);
app.use("/api/v1/getuser", getuserRouter);
app.use("/api/v1/sendmail", sendmailRouter);
app.use("/api/v1/getmessage", getmessageRouter);
app.use("/api/v1/getuserlist", getuserlistRouter);

// Store user information (username and socket.id)
const users = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join", async (email) => {
    // Store the user information
    users[email] = { socketId: socket.id };
  });

  const online = async () => {
    try {
      const filter = { email: email };
      const update = { $set: { online: "true" } };

      await UserlistSchema.updateMany(filter, update);
    } catch (error) {
      console.log(error);
    }
  };
  online();

  socket.on("message", (data) => {
    const { receiverusername, senderusername, messagetosend } = data;

    // Find the socket ID of the recipient based on their email
    const recipientSocketId = users[receiverusername]?.socketId;

    io.to(recipientSocketId).emit("privateMessage", {
      senderUsername: senderusername,
      receivedmessage: messagetosend,
      receiverusername,
    });
    savetodb(senderusername, receiverusername, messagetosend);
  });

  // saving message to db
  const savetodb = async (senderusername, receiverusername, messagetosend) => {
    try {
      const createdmessage = await Messageschema.create({
        senderusername,
        receiverusername,
        message: messagetosend,
      });
      console.log("message saved to DB");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Handle disconnection
  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
    const test = Object.entries(users);
    for (let key of test) {
      if (socket.id === key[1].socketId) {
        try {
          const filter = { email: key[0] };
          const update = { $set: { online: "false" } };

          await UserlistSchema.updateMany(filter, update);
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
});

// listener
server.listen(port1, () => {
  console.log("Server is running");
});
