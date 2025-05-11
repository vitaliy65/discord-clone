import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";

// routes
import userRoutes from "./routes/api/user.js";
import friendRoutes from "./routes/api/friend.js";
import friendRequestRoutes from "./routes/api/friendRequest.js";
import channelRoutes from "./routes/api/channel.js";
import chatRoutes from "./routes/api/chat.js";
import uploadRoutes from "./routes/api/upload.js";

//handlers
import handleChat from "./handlers/chatHandler.js";
import {
  handleNewFriendRequest,
  handleAcceptFriendRequest,
} from "./handlers/friendRequestHandler.js";
import { friendStatusHandler } from "./handlers/friendHandler.js";

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Passport config
import { passportConfig } from "./config/passport.js";
passportConfig(passport);

// DB Config
const db = process.env.MONGODB_URL;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO ===================================================================
export const io = new Server(httpServer, {
  cors: {
    origin: dev
      ? "http://localhost:5173" // 👈 клієнтський домен у режимі розробки
      : "https://discord-clone-dq4f.onrender.com", // 👈 клієнтський домен у режимі продакшн
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Initialize chat handlers
  socket.on("send_message", ({ chatId, content, type, senderId }) =>
    handleChat({ chatId, content, type, senderId, socket, io })
  );

  socket.on("friend_request_send", ({ username }) =>
    handleNewFriendRequest({ username, socket, io })
  );

  socket.on("accept_friend_request", ({ senderId, receiverId }) =>
    handleAcceptFriendRequest({ senderId, receiverId, socket, io })
  );

  socket.on("user_status_change", async ({ userId, status }) =>
    friendStatusHandler({ userId, status, socket, io })
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("register_user", (userId) => {
    socket.join(userId);
  });
});
// ========================================================================================

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});
app.use("/api/users", userRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/friendRequest", friendRequestRoutes);
app.use("/api/channel", channelRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", uploadRoutes);

// Start server
httpServer.listen(PORT, () => {
  console.log(`\nServer running on port: ${PORT}`);
  console.log(`Socket.IO server running!`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
