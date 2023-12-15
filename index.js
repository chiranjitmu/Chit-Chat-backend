import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http, { get } from "http";
import { Server } from "socket.io";
import registerRouter from "./routes/registerRoutes.js";
import loginRouter from "./routes/loginRoutes.js";
import verifyRouter from "./routes/verifyotpRoutes.js";
import resendRouter from "./routes/resendotpRoutes.js";
import getuserRouter from "./routes/getuserRoutes.js";
import getmessageRouter from "./routes/getmessageRoutes.js";
import Messageschema from "./models/messageSchema.js";
import getuserlistRouter from "./routes/getuserlistRoutes.js";

// appconfig
const app = express();
dotenv.config();
const port2 = process.env.PORT2;
const server = http.createServer(app);

// middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(bodyParser.json());

// socket initialize
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
app.use("/api/v1/getmessage", getmessageRouter);
app.use("/api/v1/getuserlist", getuserlistRouter);

// Store user information (username and socket.id)
const users = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join", (email) => {
    // Store the user information
    users[email] = { socketId: socket.id };
  });

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
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
  });
});

// listener
server.listen(port2, () => {
  console.log("Server is running");
});
